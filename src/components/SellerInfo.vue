<template>
<div>
            <v-card>
                <v-list rounded class="px-3">
                  <v-subheader><div v-text="this.objSellerInfo.name"/><v-spacer/><v-btn class="float-right" @click="closeSellerInfo" color="primary lighten-3" ><v-icon>mdi-close</v-icon></v-btn></v-subheader>
                  
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-clock</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="this.objSellerInfo.created_at"></v-list-item-title>
                        <v-list-item-subtitle>업데이트</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-archive-arrow-down-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="this.objSellerInfo.stock_at"></v-list-item-title>
                        <v-list-item-subtitle>입고</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item :class="remain_stat2Color(this.objSellerInfo.remain_stat)">
                      <v-list-item-icon>
                        <v-icon>mdi-clock</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="remain_stat2Text(this.objSellerInfo.remain_stat)"></v-list-item-title>
                        <v-list-item-subtitle>재고</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
            <v-card class="mt-3">
                <v-list-item class="text-center">
                        <v-list-item-content>
                            <div>
                            <v-icon class="mr-3">mdi-link</v-icon>
                            <v-btn @click="onBtnDaumMap" class="mr-2" color="yellow darken-1">카카오</v-btn>
                            <v-btn @click="onBtnNaverMap" class="mr-2" color="green">네이버</v-btn>
                            <v-btn @click="onBtnGoogleMap" color="pink lighten-1">구글</v-btn>
                            </div>
                        </v-list-item-content>
                        <!-- <v-list-item-content>
                            <div>
                            <v-icon class="mr-5">mdi-android</v-icon>
                            <v-btn @click="onBtnDaumMap" color="yellow darken-1">카카오맵</v-btn>
                            <v-btn @click="onBtnNaverMap" color="green">네이버맵</v-btn>
                            <v-btn @click="onBtnGoogleMap" color="pink lighten-1">구글맵</v-btn>
                            </div>
                        </v-list-item-content>
                        <v-list-item-content>
                            <div>
                            <v-icon class="mr-5">mdi-apple</v-icon>
                            <v-btn @click="onBtnDaumMap" color="yellow darken-1">카카오맵</v-btn>
                            <v-btn @click="onBtnNaverMap" color="green">네이버맵</v-btn>
                            <v-btn @click="onBtnGoogleMap" color="pink lighten-1">구글맵</v-btn>
                            </div>
                        </v-list-item-content> -->
                </v-list-item>
            </v-card>
            <v-card class="mt-3">
                <v-subheader> <v-switch v-model="showStaticMap" label="지도 고정"></v-switch></v-subheader>
                <vue-daum-map
                :appKey="appKey"
                :center.sync="center"
                :level.sync="level"
                :mapTypeId="mapTypeId"
                :libraries="libraries"
                @load="onLoad"
                style="width:100%;height:350px"/>
                <!-- <div
                ref="map"
                disabled
                style="width:100%;height:350px"/> -->
            </v-card>
</div>            
</template>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6f428547f8ff26402d2ede8daa8b240c&autoload=false"></script>

<script>
    import VueDaumMap from 'vue-daum-map';
    export default {
        components: {
            VueDaumMap,
        },
        props: {
            closeSellerInfo: {type: Function},
            objSellerInfo:{default:null},
        },
        data() {
            return {
                key: 1,
                activeBtn:1,
                showStaticMap:true,

                appKey: '6f428547f8ff26402d2ede8daa8b240c',
                center: {lat:this.objSellerInfo.lat, lng:  this.objSellerInfo.lng},
                level: 4, 
                mapTypeId: VueDaumMap.MapTypeId.NORMAL, 
                libraries: [],
                map: null,
                centerMarker:null,
            }
        },
        mounted:function(){

            // var option = { 
            //     center: new kakao.maps.LatLng(this.objSellerInfo.lat, this.objSellerInfo.lng),
            //     level: 3, 
            // };
            // var map=new kakao.maps.Map(this.$refs.map,option);
            // this.map= map;
            // this.onLoad(map);
        },
        watch:{
          showStaticMap(bool){
            if(bool){
              this.map.setCenter(new kakao.maps.LatLng(this.objSellerInfo.lat,this.objSellerInfo.lng));
              this.map.setDraggable(false);
              this.map.setZoomable(false);
            }
            else{
              this.map.setDraggable(true);
              this.map.setZoomable(true);
            }
          },
          showSellerInfo(bool){
            if(bool){
              
                
            }
          }
        },
        methods:{
            onBtnDaumMap:function(){
                window.open('https://map.kakao.com/link/map/'+ this.objSellerInfo.name +','+this.objSellerInfo.lat+','+this.objSellerInfo.lng);
            },
            onBtnNaverMap:function(){
                window.open('http://map.naver.com/index.nhn?enc=utf8&level=2&lng='+ this.objSellerInfo.lng +'&lat='+this.objSellerInfo.lat+'&pinTitle='+this.objSellerInfo.name);
            },
            onBtnGoogleMap:function(){
                window.open('https://www.google.com/maps/search/?api=1&query='+this.objSellerInfo.lat+','+ this.objSellerInfo.lng);
            },
            onLoad (map) {
                this.map=map;
                map.setDraggable(false);
                map.setZoomable(false);
                map.setMaxLevel(6);

                this.centerMarker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(this.objSellerInfo.lat, this.objSellerInfo.lng)
                });

                var startLat,startLng,startLevel;
                kakao.maps.event.addListener(map, 'zoom_start', function() {
                    startLat=map.getCenter().getLat();
                    startLng=map.getCenter().getLng();
                    startLevel=map.getLevel();
                });
                kakao.maps.event.addListener(map, 'zoom_changed', function() {
                    if(map.getLevel()>startLevel)
                        map.setCenter(new kakao.maps.LatLng(startLat,startLng));
                });
            },
            remain_stat2Text(stat){
                switch(stat){
                  case 'few':
                    return '2개~29개';
                  case 'some':
                    return '30개~99개';
                  case 'plenty':
                    return '100개~';
                  case 'empty':
                    return '0~1개';
                  default:
                    return '알수없음';
                }  
            },
            remain_stat2Color(stat){
                switch(stat){
                  case 'few':
                    return 'red lighten-4';
                  case 'some':
                    return 'yellow lighten-4';
                  case 'plenty':
                    return 'green lighten-4';
                  default:
                    return 'grey lighten-1';
                }  
            },
        },
    }
</script>