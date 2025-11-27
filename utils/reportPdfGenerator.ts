import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { theme } from "@/constants/theme";
import { dosageUnitLabels } from "@/services/@types/enums";
import type { ReportDtoResponse } from "@/services/@types/report";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

const formatTime = (timeString: string): string => {
  // Assume formato HH:mm:ss ou HH:mm
  const parts = timeString.split(":");
  return `${parts[0]}:${parts[1]}`;
};

const getDosageUnitLabel = (dosageUnit: string | number): string => {
  if (typeof dosageUnit === "number") {
    const unit = dosageUnit as keyof typeof dosageUnitLabels;
    return dosageUnitLabels[unit] || String(dosageUnit);
  }
  // Se for string, tenta converter
  const stringToLabel: Record<string, string> = {
    Mg: "Miligramas (mg)",
    Ml: "Mililitros (ml)",
    G: "Gramas (g)",
    Mcg: "Microgramas (mcg)",
    Gota: "Gotas",
    Comprimido: "Comprimidos",
    Capsula: "Cápsulas",
    Unidade: "Unidades",
  };
  return stringToLabel[dosageUnit] || dosageUnit;
};

const getFrequencyTypeLabel = (frequencyType: string | number): string => {
  if (typeof frequencyType === "number") {
    const labels: Record<number, string> = {
      1: "Diário",
      2: "Semanal",
      3: "Mensal",
    };
    return labels[frequencyType] || String(frequencyType);
  }
  const labels: Record<string, string> = {
    Daily: "Diário",
    Weekly: "Semanal",
    Monthly: "Mensal",
  };
  return labels[frequencyType] || frequencyType;
};

const getWeekDaysLabel = (weekDays: (string | number)[]): string => {
  const labels: Record<string | number, string> = {
    Monday: "Seg",
    Tuesday: "Ter",
    Wednesday: "Qua",
    Thursday: "Qui",
    Friday: "Sex",
    Saturday: "Sáb",
    Sunday: "Dom",
    1: "Seg",
    2: "Ter",
    3: "Qua",
    4: "Qui",
    5: "Sex",
    6: "Sáb",
    7: "Dom",
  };
  return weekDays.map((day) => labels[day] || String(day)).join(", ");
};

const generateMedicinesSection = (data: ReportDtoResponse): string => {
  if (!data.medicinesData) {
    return "";
  }

  const { medicines, totalMedicines, activeMedicines, adherenceRate } =
    data.medicinesData;

  let html = `
    <div style="margin-top: 30px;">
      <h2 style="color: ${theme.colors.accent.secondary}; border-bottom: 2px solid ${theme.colors.accent.secondary}; padding-bottom: 10px;">
        Relatório de Medicações
      </h2>
      
      <div style="margin-top: 20px; margin-bottom: 20px; padding: 15px; background-color: ${theme.colors.background.default}; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div style="margin: 5px 0; color: ${theme.colors.text.default};">
            <strong>Total de Medicações:</strong> ${totalMedicines}
          </div>
          <div style="margin: 5px 0; color: ${theme.colors.text.default};">
            <strong>Medicações Ativas:</strong> ${activeMedicines}
          </div>
          <div style="margin: 5px 0; color: ${theme.colors.text.default};">
            <strong>Taxa de Adesão:</strong> ${adherenceRate.toFixed(2)}%
          </div>
        </div>
      </div>
  `;

  if (medicines.length === 0) {
    html += `<p style="color: ${theme.colors.text.muted}; font-style: italic;">Nenhuma medicação encontrada no período selecionado.</p>`;
  } else {
    medicines.forEach((medicine, index) => {
      html += `
        <div style="margin-bottom: 25px; padding: 15px; border: 1px solid ${theme.colors.border.default}; border-radius: 8px; background-color: ${theme.colors.background.light};">
          <h3 style="color: ${theme.colors.text.default}; margin-top: 0; margin-bottom: 10px;">
            ${index + 1}. ${medicine.name}
          </h3>
          
          <div style="margin-bottom: 10px; color: ${theme.colors.text.default};">
            <strong>Dosagem:</strong> ${medicine.dosageValue} ${getDosageUnitLabel(medicine.dosageUnit)}
          </div>
          
          <div style="margin-bottom: 10px; color: ${theme.colors.text.default};">
            <strong>Período:</strong> ${formatDate(medicine.startDate)} 
            ${medicine.endDate ? `até ${formatDate(medicine.endDate)}` : "(em andamento)"}
          </div>
          
          ${medicine.observations ? `<div style="margin-bottom: 10px; color: ${theme.colors.text.default};"><strong>Observações:</strong> ${medicine.observations}</div>` : ""}
          
          ${
            medicine.schedules.length > 0
              ? `
            <div style="margin-top: 15px;">
              <strong style="color: ${theme.colors.text.default};">Horários de Administração:</strong>
              <ul style="margin-top: 5px; padding-left: 20px; color: ${theme.colors.text.default};">
                ${medicine.schedules
                  .map(
                    (schedule) => `
                  <li style="margin-bottom: 5px;">
                    ${formatTime(schedule.scheduledTime)} - 
                    ${getFrequencyTypeLabel(schedule.frequencyType)}
                    ${schedule.weekDays.length > 0 ? ` (${getWeekDaysLabel(schedule.weekDays)})` : ""}
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          `
              : ""
          }
        </div>
      `;
    });
  }

  html += "</div>";
  return html;
};

const generateVitalSignsSection = (data: ReportDtoResponse): string => {
  if (!data.vitalSignsData) {
    return "";
  }

  const { weightKg, heightCm, bloodPressure, bloodSugar, lastUpdated } =
    data.vitalSignsData;

  let html = `
    <div style="margin-top: 30px;">
      <h2 style="color: ${theme.colors.accent.secondary}; border-bottom: 2px solid ${theme.colors.accent.secondary}; padding-bottom: 10px;">
        Informações Vitais
      </h2>
      
      <div style="margin-top: 20px; padding: 15px; background-color: ${theme.colors.background.default}; border-radius: 8px;">
  `;

  if (weightKg) {
    html += `<div style="margin: 10px 0; color: ${theme.colors.text.default};"><strong>Peso:</strong> ${weightKg} kg</div>`;
  }
  if (heightCm) {
    html += `<div style="margin: 10px 0; color: ${theme.colors.text.default};"><strong>Altura:</strong> ${heightCm} cm</div>`;
  }
  if (bloodPressure) {
    html += `<div style="margin: 10px 0; color: ${theme.colors.text.default};"><strong>Pressão Arterial:</strong> ${bloodPressure} mmHg</div>`;
  }
  if (bloodSugar) {
    html += `<div style="margin: 10px 0; color: ${theme.colors.text.default};"><strong>Glicose:</strong> ${bloodSugar} mg/dL</div>`;
  }
  if (lastUpdated) {
    html += `<div style="margin: 10px 0; color: ${theme.colors.text.default};"><strong>Última Atualização:</strong> ${formatDate(lastUpdated)}</div>`;
  }

  const hasVitalSigns = weightKg || heightCm || bloodPressure || bloodSugar;
  if (!hasVitalSigns) {
    html += `<p style="color: ${theme.colors.text.muted}; font-style: italic;">Nenhuma informação vital registrada.</p>`;
  }

  html += "</div></div>";
  return html;
};

const generateCompleteSection = (data: ReportDtoResponse): string => {
  if (!data.completeData) {
    return "";
  }

  const { medicines, overallAdherenceRate } = data.completeData;

  const html = `
    <div style="margin-top: 30px;">
      <h2 style="color: ${theme.colors.accent.primary}; border-bottom: 2px solid ${theme.colors.accent.primary}; padding-bottom: 10px;">
        Resumo Geral
      </h2>
      
      <div style="margin-top: 20px; padding: 15px; background-color: ${theme.colors.accent.primaryFaded}; border-radius: 8px; border-left: 4px solid ${theme.colors.accent.primary};">
        <div style="font-size: 18px; font-weight: bold; color: ${theme.colors.accent.primary}; margin-bottom: 10px;">
          Taxa de Adesão Geral: ${overallAdherenceRate.toFixed(2)}%
        </div>
        <div style="color: ${theme.colors.text.default};">
          Total de Medicações: ${medicines.totalMedicines} | 
          Medicações Ativas: ${medicines.activeMedicines}
        </div>
      </div>
    </div>
  `;

  return html;
};

const generateReportHTML = (data: ReportDtoResponse): string => {
  const reportTypeLabels: Record<string, string> = {
    medicines: "Relatório de Medicações",
    vitalSigns: "Relatório de Informações Vitais",
    complete: "Relatório Completo",
  };

  const title = reportTypeLabels[data.type] || "Relatório";

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: ${theme.colors.text.default};
          line-height: 1.6;
          background-color: ${theme.colors.background.light};
        }
        h1 {
          color: ${theme.colors.accent.primary};
          border-bottom: 3px solid ${theme.colors.accent.primary};
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        h2 {
          color: ${theme.colors.accent.primary};
          margin-top: 30px;
          margin-bottom: 15px;
        }
        h3 {
          color: ${theme.colors.text.default};
          margin-top: 15px;
          margin-bottom: 10px;
        }
        .header-info {
          background-color: ${theme.colors.background.default};
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
          color: ${theme.colors.text.default};
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid ${theme.colors.border.default};
          color: ${theme.colors.text.muted};
          font-size: 12px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      
      <div class="header-info">
        <div><strong>Período:</strong> ${formatDate(data.startDate)} até ${formatDate(data.endDate)}</div>
        <div style="margin-top: 5px;"><strong>Data de Geração:</strong> ${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString("pt-BR")}</div>
      </div>
  `;

  // Adicionar seções baseado no tipo de relatório
  if (data.type === "complete" && data.completeData) {
    html += generateCompleteSection(data);
    html += generateMedicinesSection({
      ...data,
      medicinesData: data.completeData.medicines,
    });
    html += generateVitalSignsSection({
      ...data,
      vitalSignsData: data.completeData.vitalSigns,
    });
  } else {
    if (data.medicinesData) {
      html += generateMedicinesSection(data);
    }
    if (data.vitalSignsData) {
      html += generateVitalSignsSection(data);
    }
  }

  html += `
      <div class="footer">
        <p>Relatório gerado pelo sistema Remedin</p>
        <p>Este documento foi gerado automaticamente e contém informações confidenciais.</p>
      </div>
    </body>
    </html>
  `;

  return html;
};

export async function generateAndDownloadPDF(
  reportData: ReportDtoResponse
): Promise<void> {
  try {
    const html = generateReportHTML(reportData);

    // Gerar PDF
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Nome do arquivo
    const fileName = `Relatorio_${reportData.type}_${new Date().toISOString().split("T")[0]}.pdf`;

    // Compartilhar/Baixar o arquivo
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Salvar Relatório PDF",
      });
    } else if (Platform.OS === "web" && typeof document !== "undefined") {
      // Fallback para web: usar o URI original
      const link = document.createElement("a");
      link.href = uri;
      link.download = fileName;
      link.click();
    }
  } catch (error) {
    throw new Error(
      `Erro ao gerar PDF: ${error instanceof Error ? error.message : "Erro desconhecido"}`
    );
  }
}
