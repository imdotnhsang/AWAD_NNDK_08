<template>
    <div>
        <CRow class="justify-content-center">
            <CCol col="12" lg="12" xl="10">
                <CCard>
                    <CCardHeader>
                        <CRow>
                            <CCol col="12" lg="9" xl="9">
                                <CInput
                                    label="Email/Card number"
                                    placeholder="Enter email or card number"
                                    v-model="emailOrCardNumber"
                                    style="margin-bottom:10px;"
                                >
                                 <template #append>
                                    <CButton color="info" @click="searchCustomer"><i class="fas fa-search"></i></CButton>
                                </template>
                                </CInput>
                            </CCol>
                            <CCol col="12" lg="3" xl="3">
                                 <CButton class="add-account" pressed block color="danger" aria-pressed="true" @click="showModalCreateAccount">New account</CButton>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <div class="table-responsive">
                            <table class="table table-striped border-table">
                                <thead style="background-color: #EEEEEE;">
                                    <tr>
                                        <th width="5%">

                                        </th>
                                        <th>
                                            Account
                                        </th>
                                        <th>
                                            Phone
                                        </th>
                                        <th>
                                            Email
                                        </th>
                                        <th style="width:15%;">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="tbody" v-if="listCustomer && listCustomer.length != 0">
                                    <tr v-for="(value,index) in listCustomer" :key="index">
                                        <td width="5%">{{start + index}}</td>
                                        <td>
                                            <span>{{value.full_name}}</span><br>
                                            <span>{{value.default_account_id}}</span>
                                        </td>
                                        <td>
                                            {{value.phone_number}}
                                        </td>
                                        <td>
                                            {{value.email}}
                                        </td>
                                        <td>
                                            <button class="btn my-btn-primary responsive-btn" :class="{'disabled': !value.is_active}" @click="showModalRechareAccount(value)">
                                            <!-- <span><i class="fas fa-cog"></i></span> -->
                                                Recharge Account
                                            </button><br>
                                            <button class="btn my-btn-blue" :class="{'disabled': !value.is_active}" style="margin-top: 10px;"  @click="showModalAccountDetail(value)">
                                                <!-- <span><i class="fas fa-undo-alt"></i></span> -->
                                                View Account Detail
                                            </button>
                                            <!-- <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount(value)"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail(value)"><i class="fas fa-info-circle btn-account-info"></i></span> -->
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td colspan="5" style="padding:20px;text-align:center;">Not found any customer</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row" style="margin-bottom:-20px;">
                            <div class="col-lg-6">
                                   <span>Show <b>{{start}} - {{end}}</b> in <b>{{total}}</b> accounts. Maximum
                                    <div class="form-group" style="display:inline-block;" @change="onChangeLimit($event)">
                                        <select class="form-control" v-model="currentLimit">
                                            <option>10</option>
                                            <option>20</option>
                                            <option>50</option>
                                            <option>100</option>
                                        </select>
                                    </div>
                                    accounts each page
                                </span>
                            </div>
                            <div class="col-lg-6">
                               <div class="paginate-container">
                                    <paginate
                                    :page-count="lastIndex"
                                    :prev-text="'&#8249;'"
                                    :next-text="'&#8250;'"
                                    :container-class="'pagination'"
                                    :page-class="'page-item'"
                                    :page-link-class="'page-link'"
                                    :prev-link-class="'page-link'"
                                    :next-link-class="'page-link'"
                                    :first-last-button="true"
                                    :last-button-text="'&#187;'"
                                    :first-button-text="'&#171;'"
                                    :click-handler="onPaginationClick"
                                    v-model="index"
                                    :hide-prev-next="true">
                                    
                                    </paginate>
                               </div>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        <CreateAccount ref="modalCreateAccount"/>
        <RechargeAccount ref="rechargeAccount"/>
        <AccountDetail ref="accountDetail"/>
    </div>
</template>

<script>
import {mapState} from "vuex"
import {getDateFromTimeStamp,formatMoney} from "@/utils/convert"
import {getPageInUrl, getLimitInUrl,setUrlDefault,getSearchTextInUrl,setUrlWithSearch,getAccountIdInUrl,getTransactionTypeInUrl} from "@/utils/getInfo"
export default {
    name: "Accounts",
    data() {
        return {
            emailOrCardNumber: "",
            index:1,
            limit:10,
            start: 0,
            end: 0,
            total: 0,
            lastIndex: 1,
            currentLimit: 10
        }
    },
    components: {
        CreateAccount: () => import("@/views/employee/CreateAccount.vue"),
        RechargeAccount: () => import("@/views/employee/RechargeAccount.vue"),
        AccountDetail: () => import("@/views/employee/AccountDetail.vue")
    },
    computed: {
        ...mapState({
            listCustomer: state => state.employee.listCustomer,
            customerDetail: state => state.employee.customerDetail
        })
    },
    async mounted() {
        this.index = getPageInUrl()
        this.limit = getLimitInUrl()
        this.emailOrCardNumber = getSearchTextInUrl()
        await this.loadData()
    },
    methods: {
        showModalCreateAccount() {
            this.$refs.modalCreateAccount.showModal()
        },
        async showModalRechareAccount(value) {
            this.$store.commit("LOADING_REDIRECT",{
                isLoadingRedirect: true,
                time: 0
            })
            const payload = {
                q: {
                    email:value.email
                }
            }
            const response = await this.$store.dispatch("employee/getCustomerWithBalance",payload)
            if (this.customerDetail != null) {
                const props = {
                    name: this.customerDetail.full_name,
                    cardNumber: this.customerDetail.default_account_id,
                    balance: formatMoney(this.customerDetail.balance),
                    email: this.customerDetail.email,
                    createdAt: getDateFromTimeStamp(this.customerDetail.created_at),
                    phone: this.customerDetail.phone_number
                }
                this.$refs.rechargeAccount.showModal(props)
               
            } else {
                alert("Something went wrong. Please try again.")
            } 
            this.$store.commit("LOADING_REDIRECT",{
                isLoadingRedirect: false,
                time: 0
            })

        },
        async showModalAccountDetail(value) {
            this.$store.commit("LOADING_REDIRECT",{
                isLoadingRedirect: true,
                time: 0
            })
            const payload = {
                q: {
                    email:value.email
                }
            }
            const response = await this.$store.dispatch("employee/getCustomerWithBalance",payload)
            if (this.customerDetail != null) {
                const props = {
                    name: this.customerDetail.full_name,
                    cardNumber: this.customerDetail.default_account_id,
                    balance: formatMoney(this.customerDetail.balance),
                    email: this.customerDetail.email,
                    createdAt: getDateFromTimeStamp(this.customerDetail.created_at),
                    phone: this.customerDetail.phone_number
                }
                this.$refs.accountDetail.showModal(props)
            } else {
                alert("Something went wrong. Please try again.")
            }
            this.$store.commit("LOADING_REDIRECT",{
                isLoadingRedirect: false,
                time: 0
            })
           
        },
        async loadData() {
            this.$store.commit("LOADING_REDIRECT",{
                isLoadingRedirect: true,
                time: 0
            })
            let payload = {
                index: this.index,
                limit: this.limit,
                getTotal: true,
                reverse: true,
                search: this.emailOrCardNumber
            }
            let response = await this.$store.dispatch("employee/getAllCustomer",payload)
            if (response && !response.error) {
                this.total = response.data.total
                if ((this.total % this.limit) == 0) {
                    this.lastIndex = this.total / this.limit;
                } else {
                    this.lastIndex = parseInt(this.total/this.limit) + 1;
                }
                this.end = (this.index * this.limit) > this.total ? this.total : this.index*this.limit;
                this.start = (this.index-1)*this.limit + 1;
            } else {
                this.lastIndex = 1
                this.total = 0
                this.start = this.end = 0
            }
            this.$store.commit("LOADING_REDIRECT",{
                isLoadingRedirect: false,
                time: 200
            })
        },
        async onPaginationClick(pageNum) {
            this.index = pageNum
            setUrlDefault(this.index, this.limit)
            await this.loadData()
        },
        async searchCustomer(e) {
            e.preventDefault()
            this.index = 1
            setUrlWithSearch(this.index,this.limit,this.emailOrCardNumber)
            await this.loadData()
        },
        async onChangeLimit(event) {
            this.limit = parseInt(event.target.value);
            this.index = 1
            setUrlDefault(this.index, this.limit)
            await this.loadData()
        }
    }
}
</script>

<style scoped>
    .border-table {
        border: 1px solid #ddd;
    }
    td {
        vertical-align: middle;
    }

    .add-account {
        margin-top: 33px;
    }

    .btn-account-info-container {
        cursor:pointer; 
        margin-left: 10px;
    }

    .btn-account-info {
        color:#2eb85c;
        font-size: 18px;
    }

    .btn-recharge-money {
        color:#e55353;
        font-size: 18px;
    }

    .paginate-container {
       float: right;
   }

    .responsive-btn {
       width: 167.58px;
   }


    @media screen and (max-width: 992px) {
        .add-account {
            margin-top: 0px;
        }

        .btn-account-info-container {
            margin-left: 10px;
        }

        .btn-account-info {
            font-size: 18px;
        }

        .btn-recharge-money {
            font-size: 18px;
        }

        .paginate-container {
            float: left;
            margin-top: 10px;
        }

        .responsive-btn {
            width:auto
        }

    }

    @media screen and (max-width: 1027px)  {
           .btn-account-info-container {
            margin-left: 3px;
        }

        .btn-account-info {
            font-size: 15px;
        }

        .btn-recharge-money {
            font-size: 15px;
        }

        .responsive-btn {
            width:auto
        }
    }

    .tbody>tr:nth-child(odd) {
        background-color: #fff0e1
    }

    .tbody>tr:hover {
        background-color: #f5f5f5;
    }

    .my-btn-primary {
        background-color:#ff8300;color:white;
    }

    .my-btn-primary:hover {
        background-color: #e47a0a;
    }

    .my-btn-blue {
        background-color: #0057a1;
        color:white;
    }
    
    .my-btn-blue:hover {
        background-color: #003B6E;
    }

</style>
