<template>
    <div>
        <!-- Modal -->
        <div class="modal fade" id="modal-create-account" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add an account</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div v-if="step==1" >
                        <div style="padding-top: 10px; padding-bottom: 10px;padding-left: 20px; padding-right: 20px;background-color:#2eb85c;height: 75px;">
                            <table>
                                <tbody class="tbody-table">
                                    <tr>
                                        <td style="font-size: 25px;width: 35px;">1</td>
                                        <td style="background-color: #fff;width:">
                                        
                                        </td>
                                        <td style="padding-left:15px;">
                                            <span style="font-size:18px;">Sign-in information</span><br>
                                            <span>Provide the sign-in information</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <CInput
                            label="Email"
                            placeholder="Enter the sign-in email"
                            v-model="email"
                            style="margin-bottom:5px;margin-top:10px;"
                        />
                    </div>
                    <div v-else-if="step==2">
                        <div style="padding-top: 10px; padding-bottom: 10px;padding-left: 20px; padding-right: 20px;background-color:#2eb85c;height: 75px;">
                            <table>
                                <tbody class="tbody-table">
                                    <tr>
                                        <td style="font-size: 25px;width: 35px;">2</td>
                                        <td style="background-color: #fff;width:">
                                        
                                        </td>
                                        <td style="padding-left:15px;">
                                            <span style="font-size:18px;">Personal information</span><br>
                                            <span>Provide the personal information of the account</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <CInput
                            label="Email"
                            placeholder="Enter the sign-in email"
                            v-model="email"
                            style="margin-bottom:5px;margin-top:10px;"
                            disabled
                        />
                        <CInput
                            label="Name"
                            placeholder="Enter the account's name"
                            v-model="name"
                            style="margin-bottom:5px;margin-top:10px;"
                           
                        />
                        <CInput
                            label="Phone"
                            placeholder="Enter the account's phone number"
                            v-model="phone"
                            style="margin-bottom:5px;margin-top:10px;"
                        />
                    </div>
                    <div v-else-if="step==3">
                        <div style="padding-top: 10px; padding-bottom: 10px;padding-left: 20px; padding-right: 20px;background-color:#2eb85c;height: 75px;">
                            <table>
                                <tbody class="tbody-table">
                                    <tr>
                                        <td style="font-size: 25px;width: 35px;">3</td>
                                        <td style="background-color: #fff;width:">
                                        
                                        </td>
                                        <td style="padding-left:15px;">
                                            <span style="font-size:18px;">Intial balance</span><br>
                                            <span>Adjust intial value of balance</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <CInput
                            label="Balance"
                            type="number"
                            v-model="balance"
                            style="margin-bottom:5px;margin-top:10px;"
                        />
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
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  v-if="step==1" @click="hideModal">Cancel</button>
                    <button type="button" class="btn btn-secondary" v-else @click="step--">Back</button>
                    <button type="button" class="btn btn-success" @click="step++">Next</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CreateAccount",
    components: {
        Money: () => import("@/views/employee/Money.vue")
    },
    methods: {
        showModal() {
            this.step = 1
            $("#modal-create-account").modal('show')
        },
        hideModal() {
            this.step = 1
            $("#modal-create-account").modal('hide')
        },
        chooseValue(value) {
            this.balance = value
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
        }
    },
    data: function() {
        return {
            email: "",
            name: "",
            phone: "",
            step: 1,
            balance: "50000",
            isChosen500k: false,
            isChosen1000k: false,
            isChosen5000k:false,
            isChosen10000k: false
        }
    }
}
</script>

<style scoped>
    .tbody-table {
        color: #fff
    }
    .tbody-table td {
        vertical-align: middle;
    }
    .division::before {
        width: 3px;
        color: #fff;
    }
</style>