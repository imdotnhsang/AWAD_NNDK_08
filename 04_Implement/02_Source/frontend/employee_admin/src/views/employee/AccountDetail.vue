<template>
    <div>
        <div class="modal fade" id="modal-account-detail" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Account Detail</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                   <CRow>
                       <CCol lg="12" md="12" sm="12">
                            <div>
                                <label><span style="font-weight:bold;">Name:</span><span style="margin-left:72px">{{props.name}}</span></label><br>
                                <label><span style="font-weight:bold;">Email:</span><span style="margin-left:76px;">{{props.email}}</span></label><br>
                                <label><span style="font-weight:bold;">Phone:</span><span style="margin-left:68px;">{{props.phone}}</span></label><br>
                                <label><span style="font-weight:bold;">Card number:</span><span style="margin-left:26px">{{props.cardNumber}}</span></label><br>
                                <label><span style="font-weight:bold;">Balance:</span><span style="margin-left:60px;">{{props.balance}}</span></label><br>
                                <label><span style="font-weight:bold;">Created at:</span><span style="margin-left:42px;">{{props.createdAt}}</span></label>
                            </div>
                       </CCol>
                   </CRow>
                </div>
                <div class="modal-footer">
                     <button type="button" class="btn btn-success" data-dismiss="modal">OK</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AccountDetail",
    methods: {
        showModal(props) {
            this.props = props
            $("#modal-account-detail").modal('show')
        }
    },
    data: function() {
        return {
            props: []
        }
    }
}
</script>