<template>
    <div>
        <q-dialog
            v-model="openModal"
            persistent
            @escape-key="closeModal"
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card class="">
                <q-bar>
                    <q-space />
                    <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                        <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
                    </q-btn>
                    <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                        <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
                    </q-btn>
                    <q-btn dense flat icon="close" @click="closeModal">
                        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section class="q-pt-none" style="height: 90vh;">
                    <iframe id="pdf" style="width: 100%; height: 100%; border: none;"></iframe>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import moment from 'moment';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { ToWords } from 'to-words';
const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: false,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Pesos',
      plural: 'Pesos',
      symbol: '',
      fractionalUnit: {
        name: 'Pesos',
        plural: 'Pesos',
        symbol: '',
      },
    },
  },
});

const dateNow = moment().format('DD-MMM-YYYY');

export default {
    name: 'PrintModal',
    data(){
        return {
            openModal: false,
            maximizedToggle: true,
        }
    },
    watch:{
        modalStatus: function(newVal){
            this.openModal = newVal
            if(newVal){
              this.createPDFV2(this.appData)
            }
        }
    },
    props: {
        appData: {
            type: Object
        },
        modalStatus: {
            type: Boolean
        }
    },
    methods: {
        moment,
        async closeModal(){
            this.$emit('updatePrintStatus', false);
        },
        async createPDFV2(data){
            const url = 'files/checkVoucher.pdf'
            // const url = 'files/draftInvoice.pdf'
            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
            // Create a new PDFDocument
            const pdfDoc = await PDFDocument.load(existingPdfBytes)
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            // Add a blank page to the document
            const pages = pdfDoc.getPages()
            const totalPages = pdfDoc.getPageCount()
            const indices = pdfDoc.getPageIndices()
            const fpage = pages[0];
            // Get the width and height of the page
            const { width, height } = fpage.getSize()
          
            // Box 1
            fpage.drawText(`Check Voucher`, {
              x: 400,
              y: height - 30,
              size: 10,
              font:fontBold,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.voucherNumber}`, {
              x: 480,
              y: height - 30,
              size: 12,
              color: rgb(0, 0, 0),
            })

            fpage.drawText(`Payee/Vendor: `, {
              x: 40,
              y: height - 110,
              size: 10,
              font: fontBold,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.vendor}`, {
              x: 120,
              y: height - 110,
              size: 11,
              color: rgb(0, 0, 0),
            })
           

            fpage.drawText(`Description`, {
              x: 40,
              y: height - 150,
              size: 10,
              font: fontBold,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.particulars}`, {
              x: 40,
              y: height - 160,
              size: 10,
              lineHeight: 11,
              maxWidth: 600,
              color: rgb(0, 0, 0),
            })
            
            // Bottom
            fpage.drawText(`Approved By:  ${data.approvedBy}`, {
              x: 40,
              y: 50,
              size: 9,
              color: rgb(0, 0, 0),
            })
            fpage.drawRectangle({
                x: 35,
                y: 20,
                width: 190.3 + 80,
                height: 45,
                borderColor: rgb(0, 0, 0),
            })

            fpage.drawText(`Date Printed:  ${dateNow}`, {
              x: 40,
              y: 30,
              size: 9,
              color: rgb(0, 0, 0),
            })
            fpage.drawRectangle({
                x: 35,
                y: 20,
                width: 190.3 + 80,
                height: 22.5,
                borderColor: rgb(0, 0, 0),
            })

            fpage.drawText(`Received By:  ${data.receivedBy}`, {
              x: 315,
              y: 50,
              size: 9,
              color: rgb(0, 0, 0),
            })
            fpage.drawRectangle({
                x: 305,
                y: 20,
                width: 190 + 80,
                height: 45,
                borderColor: rgb(0, 0, 0),
            })

            fpage.drawText(`Date Received: `, {
              x: 315,
              y: 30,
              size: 9,
              color: rgb(0, 0, 0),
            })
            fpage.drawRectangle({
                x: 305,
                y: 20,
                width: 190 + 80,
                height: 22.5,
                borderColor: rgb(0, 0, 0),
            })



            

            // Get total of Check Deposited
            fpage.drawText(`Check Number`, {
              x: 45,
              y: height - 300,
              size: 9,
              maxWidth: 355,
              font: fontBold,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`Bank Details/Payment Details`, {
              x: 140,
              y: height - 300,
              size: 9,
              maxWidth: 355,
              font: fontBold,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`Check Date`, {
              x: 400,
              y: height - 300,
              size: 9,
              maxWidth: 355,
              font: fontBold,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`Amount`, {
              x: 490,
              y: height - 300,
              size: 9,
              maxWidth: 355,
              font: fontBold,
              color: rgb(0, 0, 0),
            })

            let stdCheckHeight = 15;
            let stdCheckBoxHeight = height - 310;
            let checkHieght = stdCheckBoxHeight - stdCheckHeight;
            fpage.drawRectangle({
              x: 35,
              y: checkHieght,
              width: 540,
              height: stdCheckHeight,
              borderColor: rgb(0, 0, 0),
            })
            fpage.drawRectangle({
                x: 35,
                y: checkHieght,
                width: 100,
                height: stdCheckHeight,
                borderColor: rgb(0, 0, 0),
            })
            fpage.drawRectangle({
                x: 135.5,
                y: checkHieght,
                width: 260,
                height: stdCheckHeight,
                borderColor: rgb(0, 0, 0),
            })
            fpage.drawRectangle({
                x: 395,
                y: checkHieght,
                width: 180,
                height: stdCheckHeight,
                borderColor: rgb(0, 0, 0),
            })

            let stdCheckTextHeight = height - 320;
            fpage.drawText(`${data.checkNumber}`, {
                x: 45,
                y: stdCheckTextHeight,
                size: 9,
                maxWidth: 355,
                color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.bank}`, {
                x: 140,
                y: stdCheckTextHeight,
                size: 9,
                maxWidth: 355,
                color: rgb(0, 0, 0),
            })
            fpage.drawText(`${moment(data.checkDate).format('MM/DD/YYYY')}`, {
                x: 400,
                y: stdCheckTextHeight,
                size: 9,
                maxWidth: 355,
                color: rgb(0, 0, 0),
            })
            fpage.drawText(`${Number(data.amount).toLocaleString('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`, {
              x: 490,
              y: stdCheckTextHeight,
              size: 9,
              color: rgb(0, 0, 0),
            })

            
            let amountInWords = toWords.convert(data.amount)

            fpage.drawText(`Amount Of Check: `, {
              x: 40,
              y: stdCheckTextHeight - 20,
              font: fontBold,
              size: 11,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${Number(data.amount).toLocaleString('en-US', {
               style: 'decimal',
               minimumFractionDigits: 2,
               maximumFractionDigits: 2
             })}`, {
              x: 490,
              y: stdCheckTextHeight - 20,
              font: fontBold,
              size: 11,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${amountInWords}`, {
              x: 40,
              y: stdCheckTextHeight - 40,
              size: 11,
              color: rgb(0, 0, 0),
            })

            
            const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
            document.getElementById('pdf').src = pdfDataUri;
        },
        // ending method
    },

}
</script>
