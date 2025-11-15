import { ClipboardList } from "lucide-react-native";
import { useState } from "react";
import { Button } from "@/components/ui";
import { ReportCheckboxCard } from "@/components/ui/Common/CheckboxCard";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  ScrollableContentWrapper,
} from "../../styles";
import type { ReportsModalProps } from "./ReportsModal.types";

const reportsMock = [
  {
    id: "1",
    title: "Relatório de medicações",
    description:
      "Contempla todas as medicações tomadas num período específico de tempo",
    periodStart: "28/08/2025",
    periodEnd: "28/09/2025",
  },
  {
    id: "2",
    title: "Relatório de informações vitais",
    description:
      "Contempla todas as informações vitais registradas durante um período específico de tempo",
    periodStart: "28/08/2025",
    periodEnd: "28/09/2025",
  },
  {
    id: "3",
    title: "Relatório completo",
    description:
      "Contempla tudo o que foi devidamente cadastrado, incluindo medicações, taxa de adesão ao tratamento e informações vitais em um período específico de tempo",
    periodStart: "28/08/2025",
    periodEnd: "28/09/2025",
  },
  {
    id: "4",
    title: "Relatório completo",
    description:
      "Contempla tudo o que foi devidamente cadastrado, incluindo medicações, taxa de adesão ao tratamento e informações vitais em um período específico de tempo",
    periodStart: "28/08/2025",
    periodEnd: "28/09/2025",
  },
];

export function ReportsModal({ isVisible, onClose }: ReportsModalProps) {
  const [selectedReports, setSelectedReports] = useState<Set<string>>(
    new Set()
  );

  const handleToggleReport = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedReports);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedReports(newSelected);
  };

  const handleGenerateReport = () => {
    onClose();
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
          {reportsMock.map((report) => (
            <ReportCheckboxCard
              checked={selectedReports.has(report.id)}
              description={report.description}
              key={report.id}
              onChange={(_, checked) => handleToggleReport(report.id, checked)}
              periodEnd={report.periodEnd}
              periodStart={report.periodStart}
              style={{ marginTop: 8 }}
              title={report.title}
              value={report.id}
            />
          ))}
        </ScrollableContentWrapper>
      </FormContentWrapper>
      <ButtonsWrapper addPadding>
        <Button
          disabled={selectedReports.size === 0}
          label="Emitir Relatório"
          onPress={handleGenerateReport}
          variant="primary"
        />
        <Button label="Voltar" onPress={onClose} variant="outline" />
      </ButtonsWrapper>
    </ModalPageWrapper>
  );
}
