<template>
  <v-app>
    <v-container fill-height align-center justify-center>
      <v-flex lg6 md8 sm10 xm12>
        <v-card round class="elevation-4">
          <v-container>
            <v-layout row wrap>

              <v-flex xs12 my-4 column>
                <v-layout align-center justify-center>
                  <v-card class="elevation-0" max-height="110" max-width="270">
                    <img :src="require('@/assets/logo.png')" height="100%" width="100%">
                  </v-card>
                </v-layout>
              </v-flex>

              <v-flex xs12 my-1>
                <v-layout align-center justify-center>
                  <v-text-field v-model="clientName" label="Nome do Cliente" class="limited"></v-text-field>
                </v-layout>
              </v-flex>

              <v-flex xs12 my-1>
                <v-layout align-center justify-center>
                  <v-text-field v-model="tarifa" label="Tarifa de Energia" class="limited"></v-text-field>
                </v-layout>
              </v-flex>

              <v-flex xs12 my-1>
                <v-layout align-center justify-center>
                  <v-text-field
                    prepend-inner-icon="attach_file"
                    @click:prepend-inner="pickFile"
                    @click="pickFile"
                    @input="pickFile"
                    label="Arquivo.csv"
                    class="limited"
                    :value="fileName">
                  </v-text-field>
                  <input type="file" style="display:none" ref="file" accept=".csv" @change="onFileSelected">
                </v-layout>
              </v-flex>

              <v-flex xs12 my-4>
                <v-layout align-center justify-center>
                  <v-btn color="info" @click="onSubmit">Gerar Relatório</v-btn>
                </v-layout>
              </v-flex>

              <v-dialog v-model="dialog" max-width="290">
                <v-card>
                  <v-card-title class="headline">{{ errorTitle }}</v-card-title>

                  <v-card-text>
                    {{ errorMessage }}
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" flat="flat" @click="dialog = false">
                      Fechar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      dialog: false,
      errorMessage: '',
      errorTitle: '',
      clientName: '',
      fileName: '',
      tarifa: '',
      file: null
    }
  },
  methods: {
    pickFile () {
      this.fileName = ''
      this.$refs.file.click()
    },
    onFileSelected (event) {
      this.fileName = event.target.files[0].name
      this.file = event.target.files[0]
    },
    onSubmit () {
      if (this.clientName === '') {
        this.dialog = true
        this.errorTitle = 'Erro'
        this.errorMessage = 'O nome do cliente é obrigatório'
        return
      }

      if (this.tarifa === '') {
        this.dialog = true
        this.errorTitle = 'Erro'
        this.errorMessage = 'A tarifa é obrigatória'
        return
      }

      if (isNaN(Number(this.tarifa)) || isNaN(parseFloat(this.tarifa))) {
        this.dialog = true
        this.errorTitle = 'Erro'
        this.errorMessage = 'A tarifa não é um número válido - utilize ponto para separação da fração decimal'
        return
      }

      if (this.file === null) {
        this.dialog = true
        this.errorTitle = 'Erro'
        this.errorMessage = 'O arquivo .csv é obrigatório'
        return
      }

      let formData = new FormData()
      formData.append('arquivo', this.file)
      formData.append('tarifa', this.tarifa)

      axios.post('/relatorios/gerar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
        this.$store.state.dailyReports = response.data
        this.$store.state.clientName = this.clientName
        this.$router.push('/report')
      })
      .catch(error => {
        console.log(error)
        this.errorTitle = error.response.data.error
        this.errorMessage = error.response.data.message
        this.dialog = true
      })
    }
  },
  name: 'InputForm'
}
</script>

<style scoped>
  .limited {
    max-width: 420px;
  }
</style>
