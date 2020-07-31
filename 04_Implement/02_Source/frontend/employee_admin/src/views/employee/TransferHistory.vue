<template>
    <div class="border-container" style="padding:20px;">
        <div class="table-responsive">
            <table class="table table-striped border-table">
                <thead style="background-color: #eee;">
                    <tr>
                        <th width="5%">

                        </th>
                        <th>
                            Receiver Account
                        </th>
                        <th>
                            Amount
                        </th>
                        <th>
                            Bank
                        </th>
                        <th>
                            Status
                        </th>
                        <th>
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody class="tbody" v-if="listTransferTransactionToShow[0]">
                    <tr v-for="(value,index) in listTransferTransactionToShow" :key="index">
                        <td width="5%">{{start + index}}</td>
                        <td>
                            <span>{{value.to_fullname}}</span><br>
                            <span>{{value.to_account_id}}</span>
                        </td>
                        <td>
                           {{value.transaction_amount}}
                        </td>
                        <td>
                            {{value.to_bank_id}}
                        </td>
                        <td>
                            <div v-if="value.transaction_status == 'SUCCESS'">
                                <h5><CBadge color="success">SUCCESS</CBadge></h5>
                            </div>
                            <div v-else-if="value.transaction_status == 'FAILED'">
                                 <h5><CBadge color="danger">{{value.transaction_status}}</CBadge></h5>
                            </div>
                            <div v-else>
                                <h5><CBadge color="warning" style="color:white;">{{value.transaction_status}}</CBadge></h5>
                            </div>
                        </td>
                        <td>
                            {{value.entry_time}}
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="6" style="padding:20px;text-align:center;">Not found any transaction</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row" style="margin-bottom:-20px;">
            <div class="col-lg-6" style="padding-top:8px;">
                <span>Show <b>{{start}}</b> - <b>{{end}}</b> transaction</span>
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
</template>

<script>
import {mapState} from "vuex"
import { mapGetters } from 'vuex';
import {getDateFromTimeStamp,formatMoney} from "@/utils/convert"
import {getPageInUrl, getLimitInUrl,setUrlDefault,getSearchTextInUrl,setUrlWithSearch,setUrlDefaultWithTransactionType,getAccountIdInUrl,getTransactionTypeInUrl} from "@/utils/getInfo"
export default {
    name: "TransferHistory",
    computed: {
        // ...mapState({
        //     listTransaction: state => state.employee.listTransaction
        // }),
        ...mapGetters(['listTransferTransactionToShow'])
        // listTransactionToRender() {
        //     if (!this.listTransaction || this.listTransaction == null || this.listTransaction.length == 0) {
        //         return []
        //     }
        //     const n = this.listTransaction.length
        //     const result = []
        //     for (let i=0;i<n;i++) {
        //         result.push(this.listTransaction[i])
        //         result[i].transaction_amount = formatMoney(result[i].transaction_amount)
        //         result[i].entry_time = getDateFromTimeStamp(result[i].entry_time)
        //     }
        //     return result
        // }
    },
    data:function(){
        return {
            index: 1,
            limit: 10,
            start:1,
            end: 10,
            total: 10,
            lastIndex: 1,
            accountId: ''
        }
    } ,
    async mounted() {
        this.index = getPageInUrl()
        this.limit = getLimitInUrl()
        //await this.loadData()
    },
    methods:{
        async loadData() {
            setUrlDefaultWithTransactionType(this.index,this.limit,this.accountId,'transfer')
            this.$store.commit("LOADING_REDIRECT",{
                isLoadingRedirect: true,
                time: 0
            })
            const payload = {
                data: {
                    historyAccountId: this.accountId
                },
                type: 'transfer',
                index: this.index,
                limit: this.limit,
                getTotal:true
            }
            let response = await this.$store.dispatch("employee/getTransactionHistory",payload)
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
            await this.loadData()
        },
        setAccountId(value) {
            this.accountId = value
        }
    }
}
</script>
<style scoped>
    .border-container {
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }

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

     .tbody>tr:nth-child(odd) {
        background-color: #fff0e1
    }

    .tbody>tr:hover {
        background-color: #f5f5f5;
    }


</style>