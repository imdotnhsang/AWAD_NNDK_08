<template>
    <div>
        <!-- Modal -->
        <div class="modal fade" id="modal-create-account" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{title}}</h5>
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
                            type="email"
                            style="margin-bottom:5px;margin-top:10px;"
                            invalid-feedback="Please enter a valid email"
                            autocomplete="email"
                            required
                            was-validated
                        />
                    </div>
                    <div v-else-if="step==2">
                        <div class="step2-background">
                            <table>
                                <tbody class="tbody-table">
                                    <tr>
                                        <td style="font-size: 25px;width: 35px;">2</td>
                                        <td style="background-color: #fff;width:">
                                        
                                        </td>
                                        <td style="padding-left:15px;">
                                            <span class="step2-title">Personal information</span><br>
                                            <span class="step2-info">Provide the personal information of the account</span>
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
                            invalid-feedback="Name is required"
                            required
                             was-validated
                        />
                        <CInput
                            label="Phone"
                            placeholder="Enter the account's phone number"
                            v-model="phone"
                            style="margin-bottom:5px;margin-top:10px;"
                            required
                            autocomplete="tel"
                            type="tel"
                            invalid-feedback="Phone number is invalid"
                            was-validated
                            
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
                    <div v-else-if="step==4">
                        <div>
                            <CRow>
                                <CCol lg="12" md="12" sm="12">
                                    <label>An account has successfully been created! The account's details below</label>

                                    <label style="margin-top:5px;margin-bottom:5px;">Sign-in information</label>
                                    <div style="background-color:#ddd;height:73px;padding:10px;">
                                        <label><span>Email:</span><span style="margin-left:73px;">{{email}}</span></label><br>
                                        <label><span>Password:</span><span style="margin-left:46px;">{{password}}</span></label>
                                    </div>

                                    <label style="margin-top:15px;margin-bottom:5px;">Card information</label>
                                    <div style="background-color:#ddd;height:100px;padding:10px;">
                                        <label><span>Card number:</span><span style="margin-left:25px;">{{cardNumber}}</span></label><br>
                                        <label><span>Balance:</span><span style="margin-left:58px;">{{balance}}</span></label><br>
                                        <label><span>Created at:</span><span style="margin-left:40px">{{createdAt}}</span></label>
                                    </div>

                                    <label style="margin-top:5px;margin-bottom:5px;">Personal information</label>
                                    <div style="background-color:#ddd;height:73px;padding:10px;">
                                        <label><span>Name:</span><span style="margin-left:70px;">{{name}}</span></label><br>
                                        <label><span>Phone:</span><span style="margin-left:68px;">{{phone}}</span></label>
                                    </div>

                                </CCol>
                            </CRow>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"  v-if="step==1" @click="hideModal">Cancel</button>
                    <button type="button" class="btn btn-secondary" v-else-if="step!=4" @click="step--">Back</button>
                    <button type="button" class="btn btn-success" v-if="step!=4" @click="verifyNextStep">Next</button>
                     <button type="button" class="btn btn-success" v-else @click="hideModal">OK</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getDateFromTimeStamp} from "@/utils/convert.js"
import {validateEmail} from "@/utils/check.js"
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
        },
        verifyNextStep() {
            if (this.step == 1) {
                if (validateEmail(this.email)) {
                    this.step++
                }
            } else {
                this.step++
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
            isChosen10000k: false,
            title: "Add an account",
            password: '123456',
            cardNumber: '5670 1234 6578 9182',
            createdAt: '13:00 23/05/2020'
        }
    },
    watch: {
        step: async function(val) {
            if (val != 4) {
                this.title = "Add an account"

                if (val == 3) {
                    let payload = {
                        data: {
                            fullName: this.name,
                            email: this.email,
                            phoneNumber: this.phone,
                            balance: this.balance
                        }
                    }
                    let response = await this.$store.dispatch("employee/registerCustomer", payload)
                    if (response && !response.error) {
                        this.createdAt = getDateFromTimeStamp(response.data.data.personal_info.created_at)
                    } else {
                        alert("ERROR")
                    }
                }
            } else {
                this.title = "Success!"
            }
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

    .step2-background {
        padding-top: 10px; 
        padding-bottom: 10px;
        padding-left: 20px; 
        padding-right: 20px;
        background-color:#2eb85c;
        height: 75px;
    }

    .step2-title {
        font-size: 18px;
    }

    @media screen and (max-width: 456px){
        .step2-title {
            font-size: 15px;
        }
        .step2-info {
            font-size: 10px;
        }
        .step2-background {
            padding-top:15px;
        }
    }

</style>