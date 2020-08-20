<template>
    <div>
         <div class="modal fade" id="modal-recharge-account" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" style="padding-top:5px;" id="exampleModalLabel">{{title}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                   <CRow>
                       <CCol lg="12" md="12" sm="12" v-if="step==1">
                            <div>
                                <label><span>Name:</span><span style="margin-left:76px">{{props.name}}</span></label><br>
                                <label><span>Card number:</span><span style="margin-left:25px;" v-if="props.cardNumber">{{props.cardNumber.replace(/^(\d{2})?(\d{4})?(\d{4})?(\d{4})?/g, '$1 $2 $3 $4')}}</span></label><br>
                                <label><span>Balance:</span><span style="margin-left:63px;">{{props.balance}}</span></label>
                            </div>
                            <label style="margin-top:10px;">Total amount: </label>
                            <InputMoney ref="inputMoney"/>
                             <label style="margin-top:5px;">Or select an amount of money below:</label><br>
                            <CRow>
                                <CCol lg="3" sm="12">
                                    <Money :value="500000" :mr="0" :isChosen="isChosen500k" @click="chooseValue"/>
                                </CCol>
                                <CCol lg="3" sm="12">
                                    <Money :value="1000000" :mr="0" :isChosen="isChosen1000k" @click="chooseValue"/>
                                </CCol>
                                <CCol lg="3" sm="12">
                                    <Money :value="5000000" :mr="0" :isChosen="isChosen5000k" @click="chooseValue"/>
                                </CCol>
                                <CCol lg="3" sm="12">
                                    <Money :value="10000000" :mr="0" :isChosen="isChosen10000k" @click="chooseValue"/>
                                </CCol>
                            </CRow>
                       </CCol>
                       <CCol lg="12" md="12" sm="12" v-else-if="step==2">
                           <label>You have successfully recharged the desired account</label><br>
                           <label>All changes have been saved.</label>
                       </CCol>
                   </CRow>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  @click="hideModal" v-if="step!=2">Cancel</button>
                     <button type="button" class="btn btn-success" @click="doNextStep">OK</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "RechargeAccount",
    components: {
        Money: () => import("@/views/employee/Money.vue"),
        InputMoney: () => import("@/views/employee/InputMoney.vue")
    },
    methods: {
        hideModal() {
            $("#modal-recharge-account").modal('hide')
        },
        showModal(props) {
            this.step = 1
            this.props = props
            $("#modal-recharge-account").modal('show')
        },
         chooseValue(value) {
            //this.balance = value
            this.$refs.inputMoney.setRealValue(value)
            if (value == 500000) {
                this.isChosen500k = true
                this.isChosen1000k =  false
                this.isChosen5000k= false
                this.isChosen10000k = false
            } else if (value == 1000000) {
                 this.isChosen500k = false
                this.isChosen1000k =  true
                this.isChosen5000k= false
                this.isChosen10000k = false
            } else if (value == 5000000) {
                    this.isChosen500k = false
                this.isChosen1000k =  false
                this.isChosen5000k= true
                this.isChosen10000k = false
            } else {
                 this.isChosen500k = false
                this.isChosen1000k =  false
                this.isChosen5000k= false
                this.isChosen10000k = true
            }
        },
        async doNextStep() {
            if (this.step == 1) {
                // this.step ++
                this.balance = this.$refs.inputMoney.getRealValue()

                if (this.balance < 50000) {
                    return;
                }

                 this.$store.commit("LOADING_REDIRECT",{
                    isLoadingRedirect: true,
                    time: 0
                })
                const payload = {
                    data: {
                        rechargeAccountId: this.props.cardNumber,
                        rechargeAmount: this.balance
                    }
                }
                const response = await this.$store.dispatch("employee/rechargeMoney",payload)
                if (response && !response.error) {
                    this.step++
                }
                this.$store.commit("LOADING_REDIRECT",{
                    isLoadingRedirect: false,
                    time: 0
                })
            } else {
                this.hideModal()
            }
        }
    },
    data() {
        return {
            props: [],
            isChosen500k: false,
            isChosen1000k: false,
            isChosen5000k:false,
            isChosen10000k: false,
            balance: '',
            step: 1
        }
    },
    computed: {
        title: function() {
            if (this.step == 1) {
                return "Recharge an account"
            } else if (this.step == 2 ) {
                return "Success!"
            }
        }
    }
}
</script>