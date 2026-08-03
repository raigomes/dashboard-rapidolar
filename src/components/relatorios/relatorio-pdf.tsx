"use client";

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { RelatorioData } from "@/types/relatorio";

const TEAL = "#0F766E";
const NEUTRAL_TEXT = "#0C0C0C";
const MUTED_TEXT = "#737373";
const BORDER = "#E5E5E5";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: NEUTRAL_TEXT,
    padding: 32,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: TEAL,
    paddingBottom: 12,
    marginBottom: 20,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
  },
  subtitle: {
    fontSize: 8,
    color: MUTED_TEXT,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 18,
    marginBottom: 8,
    color: NEUTRAL_TEXT,
  },
  periodo: {
    fontSize: 10,
  },
  resumo: {
    flexDirection: "row",
    gap: 12,
  },
  resumoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 10,
  },
  resumoLabel: {
    fontSize: 8,
    color: MUTED_TEXT,
    marginBottom: 4,
  },
  resumoValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: TEAL,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  th: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  td: {
    fontSize: 9,
  },
  colRank: { width: "8%" },
  colNome: { width: "52%" },
  colQtd: { width: "15%", textAlign: "right" },
  colValor: { width: "25%", textAlign: "right" },
  colTel: { width: "23%", textAlign: "right" },
  empty: {
    fontSize: 9,
    color: MUTED_TEXT,
    paddingVertical: 8,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: MUTED_TEXT,
  },
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function RelatorioPDF({ data }: { data: RelatorioData }) {
  const periodoLabel = `${formatarData(data.dataInicio)} a ${formatarData(data.dataFim)}`;

  return (
    <Document
      title={`Relatório RapidoLar — ${periodoLabel}`}
      author="RapidoLar"
      language="pt-BR"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>R</Text>
          </View>
          <View>
            <Text style={styles.title}>RapidoLar</Text>
            <Text style={styles.subtitle}>Relatório de Vendas</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Período</Text>
        <Text style={styles.periodo}>{periodoLabel}</Text>

        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.resumo}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>FATURAMENTO TOTAL</Text>
            <Text style={styles.resumoValue}>
              {currencyFormatter.format(data.faturamentoTotal)}
            </Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>TOTAL DE PEDIDOS</Text>
            <Text style={styles.resumoValue}>{data.totalPedidos}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top 10 Produtos</Text>
        {data.topProdutos.length === 0 ? (
          <Text style={styles.empty}>Sem dados no período.</Text>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colRank]}>#</Text>
              <Text style={[styles.th, styles.colNome]}>Produto</Text>
              <Text style={[styles.th, styles.colQtd]}>Qtd</Text>
              <Text style={[styles.th, styles.colValor]}>Receita</Text>
            </View>
            {data.topProdutos.map((produto, index) => (
              <View key={produto.nome} style={styles.tableRow}>
                <Text style={[styles.td, styles.colRank]}>{index + 1}</Text>
                <Text style={[styles.td, styles.colNome]}>{produto.nome}</Text>
                <Text style={[styles.td, styles.colQtd]}>
                  {produto.qtdVendida}
                </Text>
                <Text style={[styles.td, styles.colValor]}>
                  {currencyFormatter.format(produto.receita)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Top 10 Clientes</Text>
        {data.topClientes.length === 0 ? (
          <Text style={styles.empty}>Sem dados no período.</Text>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colRank]}>#</Text>
              <Text style={[styles.th, styles.colNome]}>Cliente</Text>
              <Text style={[styles.th, styles.colTel]}>Telefone</Text>
              <Text style={[styles.th, styles.colValor]}>Total</Text>
            </View>
            {data.topClientes.map((cliente, index) => (
              <View key={cliente.nome} style={styles.tableRow}>
                <Text style={[styles.td, styles.colRank]}>{index + 1}</Text>
                <Text style={[styles.td, styles.colNome]}>{cliente.nome}</Text>
                <Text style={[styles.td, styles.colTel]}>
                  {cliente.telefone ?? "—"}
                </Text>
                <Text style={[styles.td, styles.colValor]}>
                  {currencyFormatter.format(cliente.totalCompras)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            RapidoLar — Distribuidora de produtos de limpeza
          </Text>
          <Text style={styles.footerText}>
            Gerado em {dateTimeFormatter.format(new Date())}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
