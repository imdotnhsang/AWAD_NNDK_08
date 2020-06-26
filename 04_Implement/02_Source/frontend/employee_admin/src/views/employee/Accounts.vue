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
                                    <CButton color="info"><i class="fas fa-search"></i></CButton>
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
                                <thead>
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
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="listCustomer">
                                    <!-- <tr>
                                        <td width="5%">1</td>
                                        <td>
                                            <span>Justin Doe</span><br>
                                            <span>9080 9009 2323 2411</span>
                                        </td>
                                        <td>
                                            +84979279932
                                        </td>
                                        <td>
                                            email@gmail.com
                                        </td>
                                        <td>
                                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="5%">1</td>
                                        <td>
                                            <span>Justin Doe</span><br>
                                            <span>9080 9009 2323 2411</span>
                                        </td>
                                        <td>
                                            +84979279932
                                        </td>
                                        <td>
                                            email@gmail.com
                                        </td>
                                        <td>
                                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="5%">1</td>
                                        <td>
                                            <span>Justin Doe</span><br>
                                            <span>9080 9009 2323 2411</span>
                                        </td>
                                        <td>
                                            +84979279932
                                        </td>
                                        <td>
                                            email@gmail.com
                                        </td>
                                        <td>
                                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="5%">1</td>
                                        <td>
                                            <span>Justin Doe</span><br>
                                            <span>9080 9009 2323 2411</span>
                                        </td>
                                        <td>
                                            +84979279932
                                        </td>
                                        <td>
                                            email@gmail.com
                                        </td>
                                        <td>
                                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="5%">1</td>
                                        <td>
                                            <span>Justin Doe</span><br>
                                            <span>9080 9009 2323 2411</span>
                                        </td>
                                        <td>
                                            +84979279932
                                        </td>
                                        <td>
                                            email@gmail.com
                                        </td>
                                        <td>
                                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="5%">1</td>
                                        <td>
                                            <span>Justin Doe</span><br>
                                            <span>9080 9009 2323 2411</span>
                                        </td>
                                        <td>
                                            +84979279932
                                        </td>
                                        <td>
                                            email@gmail.com
                                        </td>
                                        <td>
                                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr> -->
                                    <!-- <tr>
                                        <td width="5%">1</td>
                                        <td>
                                            <span>Justin Doe</span><br>
                                            <span>9080 9009 2323 2411</span>
                                        </td>
                                        <td>
                                            +84979279932
                                        </td>
                                        <td>
                                            email@gmail.com
                                        </td>
                                        <td>
                                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr> -->
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
                                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td colspan="5" style="padding:20px;">Not found any customer</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row" style="margin-bottom:-20px;">
                            <div class="col-lg-6" style="padding-top:8px;">
                                <span>Show <b>{{start}}</b> - <b>{{end}}</b> accounts</span>
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
                                    :first-last-button=true
                                    :last-button-text="'&#187;'"
                                    :first-button-text="'&#171;'"
                                    :hide-prev-next=true>
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
            lastIndex: 1
        }
    },
    components: {
        CreateAccount: () => import("@/views/employee/CreateAccount.vue"),
        RechargeAccount: () => import("@/views/employee/RechargeAccount.vue"),
        AccountDetail: () => import("@/views/employee/AccountDetail.vue")
    },
    computed: {
        ...mapState({
            listCustomer: state => state.listCustomer
        })
    },
    async mounted() {
        await this.loadData()
    },
    methods: {
        showModalCreateAccount() {
            this.$refs.modalCreateAccount.showModal()
        },
        showModalRechareAccount() {
            const props = {
                name: "Lê Hoàng Sang",
                cardNumber: "1234 1234 1243 1234",
                balance: "500 000 VND"
            }
            this.$refs.rechargeAccount.showModal(props)
        },
        showModalAccountDetail() {
            const props = {
                name: "Lê Hoàng Sang",
                cardNumber: "1234 1234 1234 1234",
                balance: "500 000 VND",
                email: "lhsanghcmus@gmail.com",
                createdAt: "13:05 23/05/2020",
                phone: "0979279932"
            }
            this.$refs.accountDetail.showModal(props)
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
                reverse: true
            }
            let response = await this.$store.dispatch("getAllCustomer",payload)
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
        margin-top: 29px;
    }

    .btn-account-info-container {
        cursor:pointer; 
        margin-left: 30px;
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
    }

</style>
