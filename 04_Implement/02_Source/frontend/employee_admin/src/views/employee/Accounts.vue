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
                                        <td width="5%">

                                        </td>
                                        <td>
                                            Account
                                        </td>
                                        <td>
                                            Phone
                                        </td>
                                        <td>
                                            Email
                                        </td>
                                        <td>
                                            Actions
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
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
                                            <span style="cursor:pointer;" title="Recharge this account"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail"><i class="fas fa-info-circle btn-account-info"></i></span>
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
                                            <span style="cursor:pointer;" title="Recharge this account"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail"><i class="fas fa-info-circle btn-account-info"></i></span>
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
                                            <span style="cursor:pointer;" title="Recharge this account"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail"><i class="fas fa-info-circle btn-account-info"></i></span>
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
                                            <span style="cursor:pointer;" title="Recharge this account"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail"><i class="fas fa-info-circle btn-account-info"></i></span>
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
                                            <span style="cursor:pointer;" title="Recharge this account"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail"><i class="fas fa-info-circle btn-account-info"></i></span>
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
                                            <span style="cursor:pointer;" title="Recharge this account"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail"><i class="fas fa-info-circle btn-account-info"></i></span>
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
                                            <span style="cursor:pointer;" title="Recharge this account"><i class="fas fa-money-bill-wave btn-recharge-money"></i></span>
                                            <span class="btn-account-info-container" title="Account detail"><i class="fas fa-info-circle btn-account-info"></i></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row" style="margin-bottom:-20px;">
                            <div class="col-lg-6" style="padding-top:8px;">
                                <span>Show 1 - 20 accounts</span>
                            </div>
                            <div class="col-lg-6">
                               <div class="paginate-container">
                                    <paginate
                                    :page-count="20"
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
    </div>
</template>

<script>
export default {
    name: "Accounts",
    data() {
        return {
            emailOrCardNumber: ""
        }
    },
    components: {
        CreateAccount: () => import("@/views/employee/CreateAccount.vue")
    },
    methods: {
        showModalCreateAccount() {
            this.$refs.modalCreateAccount.showModal()
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
