<template>
    <div>
        <CRow class="justify-content-center">
            <CCol col="12" lg="12" xl="10">
                <CCard>
                    <CCardHeader>
                        <CRow>
                            <CCol lg="4" xl="4" sm="12">
                                <CSelect
                                    label="Choose banks:"
                                    :options="optionsBank"
                                    placeholder="Please select"
                                    @update:value="onChangeBank"
                                />
                            </CCol>
                            <CCol  lg="3" xl="3" sm="12">
                                <CInput
                                    label="From date"
                                    type="date"
                                    v-model="fromDate"
                                />
                            </CCol>
                            <CCol lg="3" xl="3" sm="12">
                                <CInput
                                    label="To date"
                                    type="date"
                                    v-model="toDate"
                                />
                            </CCol>
                            <CCol  lg="2" xl="2" sm="12">
                                <button class="btn my-btn-primary my-custom-btn" @click="getData">
                                    Get Data
                                </button>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CRow style="margin-bottom:10px;" v-if="listTransactionInterbank && listTransactionInterbank.length != 0">
                            <CCol lg="6" xl="6" md="12" sm="12">
                                <div>
                                    <span><b>Total transfer:</b> {{totalTransfer}}</span>
                                </div>
                            </CCol>
                            <CCol lg="6" xl="6" md="12" sm="12">
                                <div style="float:right;">
                                    <span><b>Total receive:</b> {{totalReceive}}</span>
                                </div>
                            </CCol>
                        </CRow>
                        <div class="table-responsive">
                            <table class="table border-table">
                                <thead style="background-color:#eee;">
                                    <tr>
                                        <th width="5%">

                                        </th>
                                        <th>
                                            Date
                                        </th>
                                        <th>
                                            Sender info
                                        </th>
                                       
                                        <th>
                                            Receiver info
                                        </th>
                                        <th>
                                            Transaction type
                                        </th>
                                        <th>
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="tbody" v-if="listTransactionInterbank && listTransactionInterbank.length != 0">
                                    <tr v-for="(value,index) in listTransactionInterbank" :key="index">
                                        <td width="5%">{{start + index}}</td>
                                        <td>
                                            <span>
                                                {{value.entry_time}}
                                            </span>
                                        </td>
                                        <td>
                                            <span>{{value.from_fullname}}</span><br>
                                            <span>{{value.from_account_id}}</span><br>
                                            <span>{{value.from_bank_id}}</span>
                                        </td> 
                                        <td>
                                            <span>{{value.to_fullname}}</span><br>
                                            <span>{{value.to_account_id}}</span><br>
                                             <span>{{value.to_bank_id}}</span>
                                        </td>
                                        <td>
                                           <div v-if="value.transaction_type == 'RECEIVE'">
                                                <h5><CBadge color="success">RECEIVE</CBadge></h5>
                                            </div>
                                            <div v-if="value.transaction_type == 'TRANSFER'">
                                                <h5><CBadge color="danger">TRANSFER</CBadge></h5>
                                            </div>
                                        </td>
                                        <td>
                                            <span>{{value.transaction_amount}}</span>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td colspan="6" style="padding:20px;text-align:center;">Not found any employee</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="row" style="margin-bottom:-20px;">
                            <div class="col-lg-6">
                                <span>Show <b>{{start}} - {{end}}</b> in <b>{{total}}</b> transactions. Maximum
                                    <div class="form-group" style="display:inline-block;" @change="onChangeLimit($event)">
                                        <select class="form-control" v-model="currentLimit">
                                            <option>10</option>
                                            <option>50</option>
                                            <option>100</option>
                                            <option>1000</option>
                                        </select>
                                    </div>
                                    transactions each page
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
        <CreateStaff ref="modalCreateStaff" />
        <ResetPassword ref="resetPassword"/>
        <UpdateStaff ref="updateStaff" @reloadDataAfterUpdateInfo="loadData"/>
    </div>
</template>
<script>
import {mapState,mapGetters} from "vuex"
import {getPageInUrl, getLimitInUrl,setUrlDefault,getSearchTextInUrl,setUrlWithSearch,getAccountIdInUrl,getTransactionTypeInUrl} from "@/utils/getInfo"
export default {
    name:"ManageTransaction",
    data: function() {
        return {
            emailOrName: '',
            start: 0,
            end: 0,
            lastIndex: 1,
            index: 1,
            limit: 1000,
            total: 0,
            optionsBank: ["All","S2Q","BaoSonBank"],
            bank:'All',
            fromDate: '',
            toDate: '',
            q: {},
            currentLimit: 10
        }
    },
    components: {
        CreateStaff: () => import("@/views/admin/CreateStaff"),
        ResetPassword: () => import("@/views/admin/ResetPassword"),
        UpdateStaff: () => import("@/views/admin/UpdateStaff"),
    },
    computed: {
        ...mapState({
            listEmployee: state => state.admin.listEmployee,
        }),
        ...mapGetters(['listTransactionInterbank','totalTransfer','totalReceive'])
    },
    async mounted() {
        this.index = getPageInUrl()
        this.limit = getLimitInUrl()
        let q = {
            $or: [
                {
                    transaction_type: 'TRANSFER',
                    to_bank_id: { $ne: 'EIGHT.Bank' },
                    from_bank_id: 'EIGHT.Bank',
                },
                {
                    transaction_type: 'RECEIVE',
                    to_bank_id: 'EIGHT.Bank',
                    from_bank_id: { $ne: 'EIGHT.Bank' },
                },
            ],
        }
        this.q = q
        await this.loadData()
    },
    methods: {
        async loadData() {
            this.$store.commit("LOADING_REDIRECT",{
                isLoadingRedirect: true,
                time: 0
            })
            let payload = {
                q: this.q,
                index: this.index,
                limit: this.limit,
                getTotal: true,
                reverse: true,
            }
            let response = await this.$store.dispatch("admin/getTransactionInterbank",payload)
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
        async getData() {
            this.index = 1
            let fromDateIndex =  Math.round((new Date()) / 1)

            if (this.fromDate != "") {
                fromDateIndex =  Math.round((new Date(this.fromDate + " 00:00:00")) / 1)
            }

            let toDateIndex =  Math.round((new Date())/ 1)
            if (this.toDate != "") {
                toDateIndex = Math.round((new Date(this.toDate + " 23:59:59")) / 1)
            }

            let q = {
                $or: [
                    {
                        transaction_type: 'TRANSFER',
                        to_bank_id: { $ne: 'EIGHT.Bank' },
                        from_bank_id: 'EIGHT.Bank',
                    },
                    {
                        transaction_type: 'RECEIVE',
                        to_bank_id: 'EIGHT.Bank',
                        from_bank_id: { $ne: 'EIGHT.Bank' },
                    },
                ]
            }
            if (this.bank != "All" && this.bank != "") {
                q.$or[0].to_bank_id.$eq = this.bank
                q.$or[1].from_bank_id.$eq = this.bank
            }

            if (this.fromDate != "" || this.toDate != "") {
                q.entry_time = {}
            }

          
            if (this.fromDate != "") {
                q.entry_time.$gte = fromDateIndex
            }
            

            if (this.toDate != "") {
                q.entry_time.$lte = toDateIndex
            }

            this.q = q
            await this.loadData()
        },
        onChangeBank(value) {
            this.bank = value
        },
        async onChangeLimit(event) {
            this.limit = parseInt(event.target.value);
            this.index = 1
            setUrlDefault(this.index, this.limit)
            await this.loadData()
        },
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
    .my-custom-btn {
        margin-top:31px;
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
        .my-custom-btn {
            margin-top:1px;
            width: 100%;
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
        .my-custom-btn {
            margin-top:1px;
             width: 100%;
        }
    }

       .tbody>tr:nth-child(odd) {
        background-color: #fff0e1
    }

    .tbody>tr:hover {
        background-color: #f5f5f5;
    }

</style>