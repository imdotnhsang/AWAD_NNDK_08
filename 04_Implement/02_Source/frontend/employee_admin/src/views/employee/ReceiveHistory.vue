<template>
    <div class="border-container" style="padding:20px;">
        <div class="table-responsive">
            <table class="table table-striped border-table">
                <thead>
                    <tr>
                        <th width="5%">

                        </th>
                        <th>
                            Sender Account
                        </th>
                        <th>
                            Amount
                        </th>
                        <th>
                            Bank
                        </th>
                        <th>
                            Type
                        </th>
                    </tr>
                </thead>
                <!-- <tbody v-if="listCustomer && listCustomer.length != 0">
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
                            <span style="cursor:pointer;" title="Recharge this account" @click="showModalRechareAccount(value)"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                            <span class="btn-account-info-container" title="Account detail" @click="showModalAccountDetail(value)"><i class="fas fa-info-circle btn-account-info"></i></span>
                        </td>
                    </tr>
                </tbody> -->
                <tbody v-if="listTransaction && listTransaction.length != 0">
                    <tr v-for="(value,index) in listTransaction" :key="index">
                        <td width="5%">1</td>
                        <td>
                            <span>{{value.from_fullname}}</span><br>
                            <span>{{value.from_account_id}}</span>
                        </td>
                        <td>
                           {{value.transaction_amount | formatMoney}}
                        </td>
                        <td>
                            {{value.from_bank_id}}
                        </td>
                        <td>
                            {{value.transaction_type}}
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
                    v-model="this.index"
                    :hide-prev-next="true">
                    </paginate>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex"
import {getDateFromTimeStamp,formatMoney} from "@/utils/convert"
export default {
    name: "ReceiveHistory",
    computed: {
        ...mapState({
            listTransaction: state => state.employee.listTransaction
        })
    },
    data:function(){
        return {
            index: 1,
            limit: 10,
            start:1,
            end: 10,
            total: 10
        }
    } ,
    async mounted() {
        await this.loadData()
    },
    methods:{
        async loadData() {
            const payload = {
                data: {
                    historyAccountId: this.accountId
                },
                type: 'receive'
            }
            await this.$store.dispatch("employee/getTransactionHistory",payload)
        }
    },
    props: [
        'accountId'
    ]
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

</style>