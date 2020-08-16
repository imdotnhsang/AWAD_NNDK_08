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
                                     @keyup="onSearchKeyUp"
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
                                    <thead style="background-color: #eeeee;">
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
                                    <tbody class="tbody" v-if="listCustomer && listCustomer.length != 0">
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
                        </div>
                        <div :class="{'hidden': !isClickedOnRow}">
                            <div style="margin-bottom:20px;">
                                <span v-if="currentAccount"><b>Account:</b> {{currentAccount.full_name}} / {{currentAccount.default_account_id}} / {{currentAccount.email}}</span>
                            </div>
                            <CTabs add-tab-classes="mt-1" :active-tab.sync="activeTab" @update:activeTab="clickTab">
                                <CTab>
                                    <div slot="title" style="height:100%;" >
                                        <CIcon name="cil-calculator"/> Receive
                                    </div>
                                    <ReceiveHistory ref="receiveHistory" :class="{'hidden':!activeReceiveTab}"/>
                                </CTab>
                                <CTab >
                                    <div slot="title">
                                        <CIcon name="cil-basket"/> Transfer
                                    </div>
                                    <TransferHistory ref="transferHistory" :class="{'hidden':!activeTranferTab}"/>
                                </CTab>
                                <CTab >
                                   <div slot="title">
                                        <CIcon name="cil-list"/> Debt repaying
                                    </div>
                                    <DebtHistory ref="debtHistory" :class="{'hidden':!activeDebtTab}" />
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
import ReceiveHistory from "@/views/employee/ReceiveHistory.vue"
import TransferHistory from "@/views/employee/TransferHistory.vue"
import DebtHistory from  "@/views/employee/DebtHistory.vue"
import {mapState} from "vuex"
import {getPageInUrl, getLimitInUrl,setUrlDefault,getSearchTextInUrl,setUrlWithSearch,setUrlDefaultWithTransactionType,getAccountIdInUrl,getTransactionTypeInUrl} from "@/utils/getInfo"
export default {
    name: "History",
    components: {
        ReceiveHistory,
        TransferHistory,
        DebtHistory
    },
    computed: {
        ...mapState({
            listCustomer: state => state.employee.listCustomer
        })
    },
    async mounted() {
        this.index = getPageInUrl()
        this.limit = getLimitInUrl()
        this.emailOrCardNumber  = getSearchTextInUrl()

        let accountId = getAccountIdInUrl()
        if (accountId != "") {
            let payload = {
                index: 1,
                limit: 1,
                getTotal: false,
                reverse: false,
                search: accountId,
                noCommitState: true
            }
            let response = await this.$store.dispatch("employee/getAllCustomer",payload)
            if (!response || response.error) {
                alert("Not found any match accountId")
                this.index = 1
                await this.loadData()
                return
            }
            this.currentAccount =  response.data.data[0]
            this.currentAccount.default_account_id = accountId
            this.isClickedOnRow = true
            let transactionType = getTransactionTypeInUrl()
            if (transactionType == "receive" || transactionType == "transfer" || transactionType == "debt-paying") {
                if (transactionType == "receive") {
                    await this.clickOnTabReceive()
                } else if (transactionType == "transfer") {
                    await this.clickOnTabTransfer()
                } else {
                    await this.clickOnTabDebt()
                }
            } else {
                transactionType = "receive"
                await this.clickOnTabReceive()
            }
        } else {
            await this.loadData()
        }
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
            currentAccount:null,
            activeReceiveTab: false,
            activeTranferTab:false,
            activeDebtTab:false,
            activeTab: 0,
            currentLimit: 10,
            backUpSearchData: ""
        }
    },
    methods: {
        async onPaginationClick(pageNum) {
            this.index = pageNum
            setUrlDefault(this.index,this.limit)
            await this.loadData()
        },
        async searchCustomer() {
            this.index = 1
            setUrlWithSearch(this.index,this.limit,this.emailOrCardNumber)
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
            this.activeReceiveTab = true
            this.activeTranferTab = this.activeDebtTab = false
            this.currentAccount = value
            this.isClickedOnRow = true
            await this.clickOnTabReceive()
        },
        async backToCustomerFilter(e) {
            e.preventDefault()
            this.isClickedOnRow = false
          //  this.$store.commit('employee/SET_LIST_TRANSACTION',[])
            await this.loadData()
        },
        async clickOnTabReceive() {
           //   this.$store.commit('employee/SET_LIST_TRANSACTION',[])
          // setUrlDefaultWithTransactionType()
           this.activeReceiveTab = true
           this.activeTranferTab = this.activeDebtTab = false
           this.activeTab = 0
           this.$refs.receiveHistory.setAccountId(this.currentAccount.default_account_id)
            await this.$refs.receiveHistory.loadData()
        },
        async clickOnTabTransfer() {
            this.activeTranferTab = true
            this.activeReceiveTab = this.activeDebtTab = false
           //   this.$store.commit('employee/SET_LIST_TRANSACTION',[])
           this.activeTab = 1
             this.$refs.transferHistory.setAccountId(this.currentAccount.default_account_id)
            await this.$refs.transferHistory.loadData()
        },
        async clickOnTabDebt() {
            this.activeDebtTab = true
            this.activeReceiveTab = this.activeTranferTab = false
            this.activeTab = 2
            this.$refs.debtHistory.setAccountId(this.currentAccount.default_account_id)
            await this.$refs.debtHistory.loadData()
        },
        async clickTab() {
           if (this.activeTab == 0) {
               await this.clickOnTabReceive()
           } else if (this.activeTab == 1) {
               await this.clickOnTabTransfer()
           } else {
               await this.clickOnTabDebt()
           }
        },
        async onChangeLimit(event) {
            this.limit = parseInt(event.target.value);
            this.index = 1
            setUrlDefault(this.index, this.limit)
            await this.loadData()
        },
        async onSearchKeyUp(e) {
            if (e.keyCode == 13 && this.backUpSearchData != "") {
                await this.searchCustomer(e)
            } else if (this.emailOrCardNumber == "" && this.backUpSearchData != "") {
                this.index = 1
                await this.loadData()
            }
            this.backUpSearchData = this.emailOrCardNumber
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

    .hidden {
        display:none;
    }

    .tbody>tr:nth-child(odd) {
        background-color: #fff0e1
    }

    .tbody>tr:hover {
        background-color: #f5f5f5;
    }

</style>