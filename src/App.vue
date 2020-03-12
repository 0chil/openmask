<template>
  <div>
    <SellerInfo 
    :objSellerInfo="objSellerInfo" 
    :closeSellerInfo="closeSellerInfo" 
    v-if="showSellerInfo"
    />
    <v-app v-if="!showSellerInfo">
      <v-app-bar
        app
        color="primary lighten-3"
        dense
        fixed
      >
        <div class="d-flex align-center" @click="onClickLogo" style="cursor:pointer;">
          <v-icon
          large
          alt="My Mask"
          class="mr-1 white--text">
            mdi-medical-bag
          </v-icon>
          <v-img width="150" :src="require('@/assets/openmask.png')"/>
        </div>
        <v-spacer/>
        <v-btn light @click="onClickCenterMe" v-if="activeBtn==0 || activeBtn==1"><v-icon>mdi-crosshairs-gps</v-icon></v-btn>
      </v-app-bar>

      <v-content>
        <List
          style="width:100%;height:100%"
          v-if="activeBtn==0"
          :storesByGeoData="storesByGeoData"
          :openSellerInfo="openSellerInfo"
          :location="location"
        />
        <Map
          ref="mapView"
          :getStoresByGeoParent="getStoresByGeo"
          :location="location"
          style="width:100%;height:100%"
          v-if="activeBtn==1"
        />
        <About
          style="width:100%;height:100%"
          v-if="activeBtn==2"
        />
      </v-content>

      <v-bottom-navigation
      :value="activeBtn"
      @change="onClickBottomNav"
      color="primary"
      grow
      fixed
      app
      >
        <v-btn>
          <span>목록</span>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
        <v-btn>
          <span>지도</span>
          <v-icon>mdi-map-marker</v-icon>
        </v-btn>
        <v-btn>
          <span>도움말</span>
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <!-- <Notice v-if="showNotice"/> -->
    </v-app>
  </div>
</template>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6f428547f8ff26402d2ede8daa8b240c"></script>

<script>
import List from './components/List';
import Map from './components/Map';
import About from './components/About';
import Notice from './components/Notice';
import SellerInfo from './components/SellerInfo';
import axios from 'axios';

export default {
  name: 'App',

  components: {
    List,Map,About,Notice,SellerInfo
  },

  data: () => ({
    activeBtn:1,
    showNotice:true,
    storesByGeoData:null,

    showSellerInfo:false,
    objSellerInfo:null,

    location:null,
    gettingLocation: false,
    errorStr:null,
  }),
  methods:{
    onClickLogo(){
      window.location="/";
    },
    onClickBottomNav(pos){
      this.activeBtn=pos;
    },
    onClickCenterMe(){
      if(this.activeBtn==1) this.$refs.mapView.setCenter();
      else if(this.activeBtn==0) this.getStoresByGeo(this.location.coords.latitude, this.location.coords.longitude);
    },
    closeSellerInfo(){
      this.showSellerInfo = !this.showSellerInfo;
    },
    openSellerInfo(obj){
      this.objSellerInfo=obj;
      this.showSellerInfo=true;
    },
    remain_stat2Number(stat){
      switch(stat){
        case 'few':
          return 4;
        case 'some':
          return 3;
        case 'plenty':
          return 2;
        default:
          return 0;
      }
    },
    sortStoresByGeoData:function(){
      var ref=this;
      //this.storesByGeoData.stores.sort();
      this.storesByGeoData.stores.sort(function(a,b){
        var aa=ref.remain_stat2Number(a), bb=ref.remain_stat2Number(b);
        return aa-bb;
      });
    },
    getStoresByGeo: function(lat, lng){
      if(this.activeBtn != 0){
        if(this.$refs.mapView.centerCircle) this.$refs.mapView.centerCircle.setMap(null);
          this.$refs.mapView.centerCircle = new kakao.maps.Circle({
            map: this.$refs.mapView.map,
            center : new kakao.maps.LatLng(lat,lng), 
            radius: this.Level2Range(this.$refs.mapView.map.getLevel()),
            strokeWeight: 3, 
            strokeColor: '#75B8FA', 
            strokeOpacity: 1, 
            strokeStyle: 'solid', 
            fillColor: '#CFE7FF', 
            fillOpacity: 0.1  
          });
      }
      axios.get('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat='+ lat +'&lng='+ lng +'&m='+this.Level2Range(this.activeBtn==0?1500:this.$refs.mapView.map.getLevel())) 
      .then(res => {
          this.storesByGeoData=res.data;
          this.sortStoresByGeoData();
          if(this.activeBtn == 0) return;
          var redImageSrc = require('@/assets/redmask.png'),
              yellowImageSrc = require('@/assets/yellowmask.png'),
              greenImageSrc = require('@/assets/greenmask.png'),
              greyImageSrc = require('@/assets/greymask.png'),
              imageSize = new kakao.maps.Size(30, 40),
              imageSizeMd = new kakao.maps.Size(20, 25),
              imageSizeSm = new kakao.maps.Size(15, 20);
          var redMarkerImage = new kakao.maps.MarkerImage(redImageSrc,imageSizeMd,{}),
              yellowMarkerImage = new kakao.maps.MarkerImage(yellowImageSrc,imageSize,{}),
              greenMarkerImage = new kakao.maps.MarkerImage(greenImageSrc,imageSize,{}),
              greyMarkerImage = new kakao.maps.MarkerImage(greyImageSrc,imageSizeSm,{});
          if(this.$refs.mapView.markerArray.length)
            for(var i=0;i<this.$refs.mapView.markerArray.length;i++)
              this.$refs.mapView.markerArray[i].setMap(null);
        for(var i=0;i<res.data.count;i++){
          var markerImage = null;
          switch(res.data.stores[i].remain_stat){
            case 'plenty':
              markerImage=greenMarkerImage;
              break;
            case 'some':
              markerImage=yellowMarkerImage;
              break;
            case 'few':
              markerImage=redMarkerImage;
              break;
            default:
              markerImage=greyMarkerImage;
          }
          var thisMarker = new kakao.maps.Marker({ 
            position: new kakao.maps.LatLng(res.data.stores[i].lat,res.data.stores[i].lng),
            image: markerImage
          });
          this.$refs.mapView.markerArray.push(thisMarker);
          thisMarker.setMap(this.$refs.mapView.map);
        }
      })
    },
    Level2Range: function(level){
          if(level<5)
            return 1500;
          else if(level<8)
            return 2500;
          else if(level<10)
            return 3500;
          else return 5000;
    },
  },
  created(){
    if(this.$cookies.get('todayClose')=="Y")
      this.showNotice=false;

    if(!("geolocation" in navigator)) {
      this.errorStr = 'Geolocation is not available.';
      alert(this.errorStr);
      return;
    }
    this.gettingLocation = true;
    navigator.geolocation.getCurrentPosition(pos => {
      this.gettingLocation = false;
      this.location = pos;
      if(this.$refs.mapView) {this.$refs.mapView.setCenter();}
    }, err => {
      this.gettingLocation = false;
      this.errorStr = err.message;
    })
  },
};
</script>
