<template>
    <div>
        <div class="modal fade" id="modal-reset-password" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Reset password</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="step==1" >
                            <CInput
                                label="Email"
                                v-model="email"
                                style="margin-bottom:10px;"
                                disabled
                            />
                            <CInput
                                label="Full name"
                                v-model="fullName"
                                style="margin-bottom:10px;"
                                disabled
                            />
                            <CInput
                                label="Phone number"
                                v-model="phoneNumber"
                                style="margin-bottom:10px;"
                                disabled
                            />
                            <CInput
                                label="Position"
                                v-model="position"
                                style="margin-bottom:10px;"
                                disabled
                            />
                        </div>
                        <div v-else>
                            <div>
                                <CRow>
                                     <CInput
                                        label="New"
                                        v-model="position"
                                        style="margin-bottom:10px;"
                                        disabled
                                    />
                                </CRow>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"  v-if="step==1" @click="hideModal">Cancel</button>
                        <button type="button" class="btn btn-success" v-if="step==1" @click="doAction">Next</button>
                        <button type="button" class="btn btn-success" v-else @click="hideModal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "ResetPassword",
    data: function() {
        return {
            step: 1,
            fullName: '',
            email: '',
            phoneNumber: '',
            options: ['Employee', 'Admin'],
            radioNames: ['Choose type'],
            currentType: 'EMPLOYEE',
            username: '',
            password: '',
            newPassword:''
        }
    },
    methods: {
        showModal(value) {
            this.step = 1
            this.fullName = value.full_name
            this.email = value.email
            this.phoneNumber = value.phone_number
            this.position = value.position
            this.username = value.username
            $("#modal-reset-password").modal('show')
        },
        async doAction() {
            // let payload = {
            //     data: {
            //         username: this.username
            //     }
            // }

        },
        hideModal() {
            $("#modal-reset-password").modal('hide')
            this.step = 1
        },
    }
}
</script>