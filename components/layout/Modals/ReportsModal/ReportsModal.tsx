import { ClipboardList } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { Button, InputDate, StyledText } from "@/components/ui";
import { ReportCheckboxCard } from "@/components/ui/Common/CheckboxCard";
import { useToast } from "@/components/ui/Toast";
import { useMemberContext } from "@/hooks";
import type { ReportDtoResponse, ReportType } from "@/services/@types/report";
import { generateReport } from "@/services/api/report";
import { useUserStore } from "@/stores/UserStore";
import { generateAndDownloadPDF } from "@/utils/reportPdfGenerator";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  ScrollableContentWrapper,
} from "../../styles";
import type { ReportsModalProps } from "./ReportsModal.types";

const reportsConfig = [
  {
    id: "medicines",
    type: "medicines" as ReportType,
    title: "Relatório de medicações",
    description:
      "Contempla todas as medicações tomadas num período específico de tempo",
  },
  {
    id: "vitalSigns",
    type: "vitalSigns" as ReportType,
    title: "Relatório de informações vitais",
    description:
      "Contempla todas as informações vitais registradas durante um período específico de tempo",
  },
  {
    id: "complete",
    type: "complete" as ReportType,
    title: "Relatório completo",
    description:
      "Contempla tudo o que foi devidamente cadastrado, incluindo medicações, taxa de adesão ao tratamento e informações vitais em um período específico de tempo",
  },
];

export function ReportsModal({ isVisible, onClose }: ReportsModalProps) {
  const { token } = useUserStore();
  const { showToast } = useToast();
  const { memberId } = useMemberContext();
  const [selectedReports, setSelectedReports] = useState<Set<string>>(
    new Set()
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleReport = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedReports);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedReports(newSelected);
  };

  const getValidationError = (): string | null => {
    if (!startDate) {
      return "Por favor, selecione a data inicial";
    }
    if (!endDate) {
      return "Por favor, selecione a data final";
    }
    if (selectedReports.size === 0) {
      return "Por favor, selecione pelo menos um tipo de relatório";
    }
    if (startDate > endDate) {
      return "A data inicial não pode ser maior que a data final";
    }
    if (!token) {
      return "Usuário não autenticado";
    }
    return null;
  };

  const processReportDownload = async (reportData: ReportDtoResponse) => {
    try {
      await generateAndDownloadPDF(reportData);
      showToast("Relatório gerado e baixado com sucesso!", "success");
      onClose();
    } catch (pdfError) {
      const errorMessage =
        pdfError instanceof Error
          ? pdfError.message
          : "Erro ao gerar PDF do relatório";
      showToast(errorMessage, "error");
    }
  };

  const fetchReportData = () => {
    const reportTypes = Array.from(selectedReports)
      .map((id) => reportsConfig.find((r) => r.id === id)?.type)
      .filter((type): type is ReportType => type !== undefined);

    const safeStartDate = startDate as Date;
    const safeEndDate = endDate as Date;
    const safeToken = token as string;

    return generateReport(
      {
        reportTypes,
        startDate: safeStartDate.toISOString().split("T")[0],
        endDate: safeEndDate.toISOString().split("T")[0],
      },
      safeToken,
      memberId || undefined
    );
  };

  const handleGenerateReport = async () => {
    const validationError = getValidationError();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchReportData();

      if (!response.success) {
        showToast(
          response.message ||
            `Erro ao gerar relatório (código: ${response.code})`,
          "error"
        );
        setIsLoading(false);
        return;
      }

      if (response.data) {
        await processReportDownload(response.data);
      } else {
        showToast("Relatório gerado mas sem dados", "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao gerar relatório";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalPageWrapper
      header={{
        title: "Relatórios",
        description:
          "Visualize e gere relatórios de suas medicações cadastradas",
        icon: <ClipboardList color="black" size={18} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <ScrollableContentWrapper>
          <StyledText style={{ marginBottom: 8 }} variant="mediumSemiBold">
            Período do Relatório
          </StyledText>
          <View style={{ gap: 8 }}>
            <InputDate
              onChange={setStartDate}
              placeholder="Data inicial"
              value={startDate}
            />
            <InputDate
              onChange={setEndDate}
              placeholder="Data final"
              value={endDate}
            />
          </View>
          <StyledText
            style={{ marginBottom: 8, marginTop: 16 }}
            variant="mediumSemiBold"
          >
            Tipos de Relatório
          </StyledText>
          {reportsConfig.map((report) => (
            <ReportCheckboxCard
              checked={selectedReports.has(report.id)}
              description={report.description}
              key={report.id}
              onChange={(_, checked) => handleToggleReport(report.id, checked)}
              periodEnd={
                endDate
                  ? endDate.toLocaleDateString("pt-BR")
                  : "Selecione a data final"
              }
              periodStart={
                startDate
                  ? startDate.toLocaleDateString("pt-BR")
                  : "Selecione a data inicial"
              }
              style={{ marginTop: 8 }}
              title={report.title}
              value={report.id}
            />
          ))}
        </ScrollableContentWrapper>
      </FormContentWrapper>
      <ButtonsWrapper addPadding>
        <Button
          disabled={
            selectedReports.size === 0 || !startDate || !endDate || isLoading
          }
          isLoading={isLoading}
          label="Emitir Relatório"
          onPress={handleGenerateReport}
          variant="primary"
        />
        <Button
          disabled={isLoading}
          label="Voltar"
          onPress={onClose}
          variant="outline"
        />
      </ButtonsWrapper>
    </ModalPageWrapper>
  );
}
