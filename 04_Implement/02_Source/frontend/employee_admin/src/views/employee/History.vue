<template>
    <div>
        <CRow class="justify-content-center">
            <CCol col="12" lg="12" xl="10">
                <CCard>
                    <CCardHeader>
                        <CRow v-if="!isClickedOnRow">
                            <CCol col="12" lg="12" xl="12">
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
                        </CRow>
                        <div v-else>
                            <CButton color="danger" @click="backToCustomerFilter">Back to customer filter</CButton>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <div v-if="!isClickedOnRow">
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
                                        </tr>
                                    </thead>
                                    <tbody v-if="listCustomer && listCustomer.length != 0">
                                        <tr style="cursor:pointer;" @click="onClickRow(value)" v-for="(value,index) in listCustomer" :key="index">
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
                                        </tr>
                                    </tbody>
                                    <!-- <tbody >
                                        <tr style="cursor:pointer;" @click="isClickedOnRow = true">
                                            <td width="5%">1</td>
                                            <td>
                                                <span>Lê Hoàng Sang</span><br>
                                                <span>8605 1123 3531 2311</span>
                                            </td>
                                            <td>
                                                0979279932
                                            </td>
                                            <td>
                                                lhsanghcmus@gmail.com
                                            </td>
                                        </tr>
                                    </tbody> -->
                                    <tbody v-else>
                                        <tr>
                                            <td colspan="5" style="padding:20px;text-align:center;">Not found any customer</td>
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
                        </div>
                        <div v-else>
                            <div style="margin-bottom:20px;">
                                <span><b>Account:</b> {{currentAccount.full_name}} / {{currentAccount.default_account_id}} / {{currentAccount.email}}</span>
                            </div>
                            <CTabs add-tab-classes="mt-1">
                                <CTab active>
                                    <div slot="title" @click="clickOnTabReceive">
                                        <CIcon name="cil-calculator"/> Receive
                                    </div>
                                    <ReceiveHistory ref="receiveHistory" v-if="currentAccount.default_account_id" :accountId="currentAccount.default_account_id"/>
                                </CTab>
                                <CTab >
                                    <div slot="title" @click="clickOnTabTransfer">
                                        <CIcon name="cil-basket"/> Transfer
                                    </div>
                                    <TransferHistory ref="transferHistory" v-if="currentAccount.default_account_id" :accountId="currentAccount.default_account_id"/>
                                </CTab>
                                <CTab>
                                   <div slot="title" @click="clickOnTabDebt">
                                        <CIcon name="cil-basket"/> Debt repaying
                                    </div>
                                    <DebtHistory ref="debtHistory" v-if="currentAccount.default_account_id" :accountId="currentAccount.default_account_id"/>
                                </CTab>
                            </CTabs>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>

<script>
import {mapState} from "vuex"
export default {
    name: "History",
    components: {
        ReceiveHistory: () => import("@/views/employee/ReceiveHistory.vue"),
        TransferHistory: () => import("@/views/employee/TransferHistory.vue"),
        DebtHistory: () => import("@/views/employee/DebtHistory.vue")
    },
    computed: {
        ...mapState({
            listCustomer: state => state.employee.listCustomer
        })
    },
    async mounted() {
        await this.loadData()
    },
    data: function() {
        return {
            emailOrCardNumber: '',
            lastIndex: 1,
            index: 1,
            start: 1,
            end: 1,
            isClickedOnRow:false,
            limit:10,
            total:0,
            currentAccount:null
        }
    },
    methods: {
        async onPaginationClick(pageNum) {
            this.index = pageNum
            await this.loadData()
        },
        async searchCustomer() {
            this.index = 1
            await this.loadData()
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
        async onClickRow(value) {
            this.currentAccount = value
            this.isClickedOnRow = true
        },
        async backToCustomerFilter(e) {
            e.preventDefault()
            this.isClickedOnRow = false
          //  this.$store.commit('employee/SET_LIST_TRANSACTION',[])
            await this.loadData()
        },
        async clickOnTabReceive() {
           //   this.$store.commit('employee/SET_LIST_TRANSACTION',[])
            await this.$refs.receiveHistory.loadData()
        },
        async clickOnTabTransfer() {
           //   this.$store.commit('employee/SET_LIST_TRANSACTION',[])
            await this.$refs.transferHistory.loadData()
        },
        async clickOnTabDebt() {
            await this.$refs.debtHistory.loadData()
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
    .paginate-container {
       float: right;
   }


    @media screen and (max-width: 992px) {
        .paginate-container {
            float: left;
            margin-top: 10px;
        }

    }

    @media screen and (max-width: 1027px)  {
         
    }

    .tab-pane {
        margin-top: 0px !important;
    }

</style>