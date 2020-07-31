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
                                />
                            </CCol>
                            <CCol  lg="4" xl="4" sm="12">
                                <CInput
                                    label="From date"
                                    type="date"
                                />
                            </CCol>
                            <CCol lg="4" xl="4" sm="12">
                                <CInput
                                    label="To date"
                                    type="date"
                                />
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <div class="table-responsive">
                            <table class="table border-table">
                                <thead>
                                    <tr>
                                        <th width="5%">

                                        </th>
                                        <th>
                                            Email
                                        </th>
                                        <th>
                                            Phone
                                        </th>
                                        <th>
                                            Fullname
                                        </th>
                                        <th>Status</th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="listEmployee && listEmployee.length != 0">
                                    <tr v-for="(value,index) in listEmployee" :key="index">
                                        <td width="5%">{{start + index}}</td>
                                        <td>
                                            {{value.email}}
                                        </td>
                                        <td>
                                            {{value.phone_number}}
                                        </td>
                                        <td>
                                            {{value.full_name}}
                                        </td>
                                        <td>
                                            <CSwitch class="mx-1" color="success" @update:checked="doActionWithStatus(value)" :checked="value.is_active" variant="3d" />
                                        </td>
                                        <!-- <td>
                                            <span style="cursor:pointer;" title="Recharge this account"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td> -->
                                        <td>
                                            <button class="btn my-btn-primary" :class="{'disabled': !value.is_active}" @click.prevent="!value.is_active ? {} : showModalUpdateInfo(value)">
                                                <span><i class="fas fa-cog"></i></span>
                                            </button>
                                            <button class="btn btn-primary" :class="{'disabled': !value.is_active}" style="margin-left:5px;" @click.prevent="!value.is_active ? {} : showModalResetPassword(value)">
                                                <span><i class="fas fa-undo-alt"></i></span>
                                            </button>
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
import {mapState} from "vuex"
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
            limit: 10,
            total: 0,
            optionsBank: ["All","S2Q","BaoSonBank"] 
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
        })
    },
    async mounted() {
        this.index = getPageInUrl()
        this.limit = getLimitInUrl()
        this.emailOrName = getSearchTextInUrl()
        await this.loadData()
    },
    methods: {
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
                search: this.emailOrName
            }
            let response = await this.$store.dispatch("admin/getAllEmployee",payload)
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
        async searchEmployee(e) {
            e.preventDefault()
            this.index = 1
            setUrlWithSearch(this.index,this.limit,this.emailOrName)
            await this.loadData()
        },
        showModalCreateStaff() {
            this.$refs.modalCreateStaff.showModal()
        },
        async onPaginationClick(pageNum) {
            this.index = pageNum
            setUrlDefault(this.index, this.limit)
            await this.loadData()
        },
        async doActionWithStatus(value) {
            let payload = {
                data: {
                    username: value.username
                }
            }

            let actionName = ""
            if (value.is_active) {
                actionName = "admin/deactiveStaff"
            } else {
                actionName = "admin/activeStaff"
            }

            let response = await this.$store.dispatch(actionName,payload)
            if (response && !response.error) {
                value.is_active = !value.is_active
            } else {
                alert("Something went wrong")
            }

        },
        showModalResetPassword(value) {
            this.$refs.resetPassword.showModal(value)
        },
        showModalUpdateInfo(value) {
            this.$refs.updateStaff.showModal(value)
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

    .my-btn-primary {
        background-color:#ff8300;color:white;
    }

    .my-btn-primary:hover {
        background-color: #e47a0a;
    }

</style>