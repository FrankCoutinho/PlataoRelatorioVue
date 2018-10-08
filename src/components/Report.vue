<template>
 <v-container pa-0>

    <v-card height="1584px" width="1120px">
      <v-layout column fill-height align-space-between justify-space-between>

        <v-layout column align-center>
          <img src="@/assets/header.png" height="200px" width="1120px">
        </v-layout>

        <v-layout align-center justify-center>
          <v-card flat height="1200px" width="1120px">
            <v-layout row justify-space-between>
              <v-flex pl-5 pr-3>
                <v-card flat>
                  <h2>Olá, {{ clientName }}!</h2>
                  <p></p>
                  <p>A Platão Energia disponibiliza o Relatório de Investimento mensal durante nosso período de avaliação e monitoramento. Por meio deste documento, é possível comprovar e avaliar o verdadeiro retorno sobre seu investimento.  O aplicativo SolarWeb, conectado ao inversor Fronius proporciona dados exatos da performance do seu sistema informando-nos a geração de energia diária. Na tabela ao lado, é possível acompanhar a geração mensal do seu sistema solar fotovoltaico paralelo ao valor economizado.</p>
                  <p>Além dos benefícios monetários, o sistema solar fotovoltaico promove uma atitude sustentável positiva ao planeta. Com base em sua geração deste mês, o(a) senhor(a) deixou de emitir {{ totalEnergyGenerated * fatorCO2 | toTwoDecimalDigits }} Kg de CO² no meio ambiente. Ou seja, se a energia consumida fosse proveniente de fontes não renováveis, este consumo emitiria {{ totalEnergyGenerated * fatorCO2 | toTwoDecimalDigits }} Kg de CO² e necessitaria de {{ totalEnergyGenerated * fatorCO2 * fatorTree | toTwoDecimalDigits }} árvores plantadas para neutralizar os impactos ambientais.</p>
                  <p>Agradecemos novamente pela sua preferência! Estamos à sua disposição para eventuais dúvidas pelos canais de atendimento ao cliente: </p>
                  <p>atendimento@plataoenergia.com.br</p>
                  <p>(44) 3224–8915 ou (44) 98456-0563</p>
                </v-card>
              </v-flex>

              <v-flex pr-5 pl-3>
                <v-card flat>
                  <v-data-table :items="reports" hide-actions class="elevation-0" disable-initial-sort=true>
                    <template slot="headers" slot-scope="props">
                      <th class="text-xs-center" :class="{header: true}">Dia</th>
                      <th class="text-xs-right" :class="{header: true}">Energia Gerada</th>
                      <th class="text-xs-right" :class="{header: true}">Valor Economizado</th>
                    </template>

                    <template slot="items" slot-scope="props">
                      <td class="text-xs-center" :class="{row: true}">{{ props.item.data | toLocalDate }}</td>
                      <td class="text-xs-right" :class="{row: true}">{{ props.item.energiaGerada | toKWH }}</td>
                      <td class="text-xs-right" :class="{row: true}">{{ props.item.valorEconomizado | toBRL }}</td>
                    </template>

                    <template slot="footer">
                      <td class="text-xs-center" :class="{row: true}"><strong>Total</strong></td>
                      <td class="text-xs-right" :class="{row: true}">{{ totalEnergyGenerated | toKWH }}</td>
                      <td class="text-xs-right" :class="{row: true}">{{ totalAmountSaved | toBRL }}</td>
                    </template>
                  </v-data-table>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>
        </v-layout>

        <v-layout column>
          <v-spacer></v-spacer>
          <img src="@/assets/footer.png" height="110px" width="1120px">
        </v-layout>
      </v-layout>

    </v-card>
  </v-container>
</template>

<script>
export default {
  created () {
    this.reports = this.$store.state.dailyReports
    this.clientName = this.$store.state.clientName
  },
  data () {
    return {
      clientName: 'Frank',
      fatorTree: 1 / 0.18,
      fatorCO2: 0.5948 / 1000,
      reports: []
    }
  },
  filters: {
    'toBRL' (value) {
      return 'R$ ' + value.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})
    },
    'toKWH' (value) {
      return value.toLocaleString('pt-BR', {maximumFractionDigits: 1, minimumFractionDigits: 1}) + ' kWh'
    },
    'toTwoDecimalDigits' (value) {
      return value.toLocaleString('pt-BR', {maximumFractionDigits: 2, minimumFractionDigits: 2})
    },
    'toLocalDate' (value) {
      return new Date(value + 'T00:00:00-0300').toLocaleDateString('pt-BR')
    }
  },
  computed: {
    totalEnergyGenerated () {
      let energyGenerated = 0

      for (let index = 0; index < this.reports.length; index++) {
        energyGenerated += this.reports[index].energiaGerada
      }
      return energyGenerated
    },
    totalAmountSaved () {
      let amountSaved = 0

      for (let index = 0; index < this.reports.length; index++) {
        amountSaved += this.reports[index].valorEconomizado
      }
      return amountSaved
    }
  }
}
</script>

<style scoped>
  .row {
    font-size: 19px;
    height: 35px
  }
  .header {
    font-size: 20px;
    height: 35px
  }
  p {
    text-align: justify
  }
</style>
