<template>
        <v-overlay v-model="notice">
            <v-card light>
                <v-card-title>
                    OPENMASK
                </v-card-title>
                <v-card-text class="text-center">
                    <img :src="greyImageSrc" width="30"><h3>0~1개</h3>
                    <img :src="redImageSrc" width="30"><h3>2~29개</h3>
                    <img :src="yellowImageSrc" width="30"><h3>30~99개</h3>
                    <img :src="greenImageSrc" width="30"><h3>100개 이상</h3>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        text
                        color="primary"
                        @click="closeMsg"
                    >
                        닫기
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="closeMsgForToday"
                    >
                        24시간 닫기
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-overlay>
</template>

<script>
    export default {
        data: () => ({
                notice: true,
                redImageSrc: require('@/assets/redmask.png'),
                yellowImageSrc: require('@/assets/yellowmask.png'),
                greenImageSrc: require('@/assets/greenmask.png'),
                greyImageSrc: require('@/assets/greymask.png'),
                msg: 'Beta'
            }
        ),
        methods: {
            closeMsg:function() {
                this.notice = false;
            },
            closeMsgForToday:function() {
                this.notice = false;
                this.$cookies.set('todayClose','Y', 86400);
            }
        },
        mounted(){
            if(this.$cookies.get('todayClose')=="Y"){
                this.notice=false;
            }
        }
    }
</script>