<template>
    <div>
        <q-dialog
            v-model="openModal"
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

const dateNow = moment().format('LL');

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
                this.createSalesPDF(this.appData)
            }
        }
    },
    props: {
        appData: {
            type: Object
        },
        appType: {
            type: String
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
        async createSalesPDF(data){
            const url = 'files/tenmeiReceipt.pdf'
            // const url = 'docs/newSI.pdf'
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
            // console.log(data)
            fpage.drawText(`${data.storeName}`, {
              x: 80,
              y: height - 80,
              size: 10,
              font: fontBold,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.address}`, {
              x: 80,
              y: height - 95,
              size: 10,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.ownerName}`, {
              x: 335,
              y: height - 80,
              size: 10,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.contact}`, {
              x: 335,
              y: height - 95,
              size: 10,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.terms}`, {
              x: 515,
              y: height - 80,
              size: 10,
              font: fontBold,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${moment(data.orderDate).format('LL')}`, {
              x: 510,
              y: height - 95,
              size: 10,
              font: fontBold,
              color: rgb(0, 0, 0),
            })

            let stdTextHeight = height - 143;
            let totalAmount = 0
            data.orderItem.forEach(el => {

                fpage.drawText(`${el.quantity}`, {
                    x: 35,
                    y: stdTextHeight,
                    size: 9,
                    font: fontBold,
                    maxWidth: 355,
                    color: rgb(0, 0, 0),
                })

                fpage.drawText(`${el.product}`, {
                    x: 70,
                    y: stdTextHeight,
                    size: 9,
                    font: fontBold,
                    maxWidth: 355,
                    color: rgb(0, 0, 0),
                })
                
                fpage.drawText(`${Number(el.srp).toLocaleString('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`, {
                    x: 275,
                    y: stdTextHeight,
                    size: 9,
                    font: fontBold,
                    maxWidth: 355,
                    color: rgb(0, 0, 0),
                })

                fpage.drawText(`${el.discount}`, {
                    x: 330,
                    y: stdTextHeight,
                    size: 9,
                    font: fontBold,
                    maxWidth: 355,
                    color: rgb(0, 0, 0),
                })


                fpage.drawText(`${Number((el.srp * el.quantity) - Number(el.discount)).toLocaleString('en-US', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`, {
                    x: 367,
                    y: stdTextHeight,
                    size: 9,
                    font: fontBold,
                    maxWidth: 355,
                    color: rgb(0, 0, 0),
                })

                stdTextHeight -= 20
                totalAmount += (Number(el.srp) * Number(el.quantity)) - Number(el.discount)
            })
            
            fpage.drawText(`C/O ${data.agentName}`, {
                x: 80,
                y: height - 290,
                size: 9,
                font: fontBold,
                color: rgb(0, 0, 0),
            })

            fpage.drawText(`PHP ${Number(totalAmount).toLocaleString('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
                })}`, {
                x: 340,
                y: height - 290,
                size: 9,
                font: fontBold,
                color: rgb(0, 0, 0),
            })




            fpage.drawText(`${data.bank}`, {
                x: 490,
                y: height - 193,
                size: 10,
                color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.postDated}`, {
                x: 490,
                y: height - 210,
                size: 10,
                color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.notes}`, {
                x: 490,
                y: height - 258,
                size: 10,
                color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.checkNo}`, {
                x: 490,
                y: height - 273,
                size: 10,
                color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.referenceNumber}`, {
                x: 490,
                y: height - 290,
                size: 11,
                font: fontBold,
                color: rgb(1, 0, 0),
            })






            fpage.drawText(`${data.ownerName}`, {
              x: 20,
              y: height - 305,
              size: 8,
              color: rgb(0, 0, 0),
            })
            fpage.drawText(`${data.address}`, {
              x: 275,
              y: height - 305,
              size: 8,
              color: rgb(0, 0, 0),
            })

            
            
            const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
            document.getElementById('pdf').src = pdfDataUri;
        },

        // ending method
    },

}
</script>
