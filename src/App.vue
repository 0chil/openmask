<template>
  <div>
    <v-app>
      <v-app-bar
        app
        color="primary lighten-3"
        dense
        fixed
      >
        <div class="d-flex align-center" @click="onClickLogo" style="cursor:pointer;">
          <v-icon
          large
          alt="OpenMask"
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
          :storesByGeoDataFiltered="storesByGeoDataFiltered"
          :openSellerInfo="openSellerInfo"
          v-show="activeBtn==0"
        />
        <Map
          ref="mapView"
          :showSellerInfo="showSellerInfo"
          :getStoresByGeo="getStoresByGeo"
          :activeBtn="activeBtn"
          :runFilter="runFilter"
          style="width:100%;height:100%"
          v-show="activeBtn==1"
        />
        <About
          style="width:100%;height:100%"
          v-if="activeBtn==2"
        />
      </v-content>
      <v-dialog v-model="showSellerInfo" :fullscreen="this.$vuetify.breakpoint.name=='xs'">
        <v-card>
          <SellerInfo 
            :objSellerInfo="objSellerInfo" 
            :closeSellerInfo="closeSellerInfo" 
            :showSellerInfo="showSellerInfo"
            v-if="showSellerInfo"
          />
        </v-card>
      </v-dialog>
      <Notice v-if="showNotice"/>

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
    </v-app>
  </div>
</template>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6f428547f8ff26402d2ede8daa8b240c&autoload=false"></script>

<script>
import List from './components/List';
import Map from './components/Map';
import About from './components/About';
import Notice from './components/Notice';
import SellerInfo from './components/SellerInfo';
import axios from 'axios';

export default {
  name: 'App',
  metaInfo: {
    titleTemplate: 'OpenMask',
    meta:[
      {name: 'apple-mobile-web-app-capable', content:'yes'},
      {name: 'mobile-web-app-capable', content:'yes'},
    ],
    htmlAttrs: {
      lang: 'ko',
    }
  },

  components: {
    List,Map,About,Notice,SellerInfo
  },

  data: () => ({
    activeBtn:1,
    showNotice:true,
    storesByGeoData:null,
    storesByGeoDataFiltered:null,
    markerArray:[],

    showSellerInfo:false,
    objSellerInfo:null,
    filterZero:true,

    location:null,
    gettingLocation: false,
    errorStr:null,

    redImageSrc: require('@/assets/redmask.png'),
    yellowImageSrc: require('@/assets/yellowmask.png'),
    greenImageSrc: require('@/assets/greenmask.png'),
    greyImageSrc: require('@/assets/greymask.png'),
  }),

  watch:{
    filterZero(bool){
      this.getStoresByGeo(this.$refs.mapView.map.getCenter().getLat(), this.$refs.mapView.map.getCenter().getLng());
    }
  },

  methods:{
    onClickLogo(){
      window.location="/";
    },
    onClickBottomNav(pos){
      this.activeBtn=pos;
    },
    onClickCenterMe(){
      this.$refs.mapView.setCenter();
    },
    closeSellerInfo(){
      this.showSellerInfo = !this.showSellerInfo;
    },
    openSellerInfo(obj){
      this.objSellerInfo=obj;
      this.showSellerInfo=true;
    },
    sortStoresByGeoData(){
      var ref=this;
      this.storesByGeoData.stores = this.storesByGeoData.stores.sort(function(a,b){
        var x=ref.remain_stat2Number(a.remain_stat), y=ref.remain_stat2Number(b.remain_stat);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    },
    runFilter(bool){
      this.filterZero=bool;
      if(this.filterZero){
        for(var i=0;i<this.storesByGeoData.stores.length;i++){
          if(this.storesByGeoData.stores[i].remain_stat == 'empty' || this.storesByGeoData.stores[i].remain_stat == 'null'){
            this.storesByGeoDataFiltered.splice(i,this.storesByGeoData.stores.length-i);
            break;
          }
        }
      }
      else{
        this.storesByGeoDataFiltered=this.storesByGeoData.stores;
      }
    },
    getStoresByGeo(lat, lng){
      if(this.$refs.mapView.centerCircle) this.$refs.mapView.centerCircle.setMap(null);
        this.$refs.mapView.centerCircle = new kakao.maps.Circle({
          map: this.$refs.mapView.map,
          center : new kakao.maps.LatLng(lat,lng), 
          radius: 2000,
          strokeWeight: 3, 
          strokeColor: '#75B8FA', 
          strokeOpacity: 1, 
          strokeStyle: 'solid', 
          fillColor: '#CFE7FF', 
          fillOpacity: 0.1  
        });
        
      var imageSize = new kakao.maps.Size(30, 40),
          imageSizeMd = new kakao.maps.Size(20, 25),
          imageSizeSm = new kakao.maps.Size(15, 20);
      var redMarkerImage = new kakao.maps.MarkerImage(this.redImageSrc,imageSizeMd,{}),
          yellowMarkerImage = new kakao.maps.MarkerImage(this.yellowImageSrc,imageSize,{}),
          greenMarkerImage = new kakao.maps.MarkerImage(this.greenImageSrc,imageSize,{}),
          greyMarkerImage = new kakao.maps.MarkerImage(this.greyImageSrc,imageSizeSm,{});
      axios.get('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat='+ lat +'&lng='+ lng +'&m=2000') 
      .then(res => {
        //check
        this.storesByGeoData=res.data;
        this.sortStoresByGeoData();
        if(this.filterZero){
          this.storesByGeoDataFiltered=this.storesByGeoData.stores.slice();
          this.runFilter(this.filterZero);
        }

        //Empty markers
        if(this.markerArray)
          for(var i=0;i<this.markerArray.length;i++)
            this.markerArray[i].setMap(null);
              
        var thisref=this;
        this.storesByGeoDataFiltered.forEach(function(store){
          var markerImage = null;
          switch(store.remain_stat){
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
            position: new kakao.maps.LatLng(store.lat,store.lng),
            image: markerImage
          });
          var thisData=store;
          kakao.maps.event.addListener(thisMarker, 'click', function() {
            thisref.openSellerInfo(store);
          });
          thisref.markerArray.push(thisMarker);
          thisMarker.setMap(thisref.$refs.mapView.map);
        });
      })
    },
    remain_stat2Number(stat){
      switch(stat){
        case 'plenty':
          return 1;
        case 'some':
          return 2;
        case 'few':
          return 3;
        case 'empty':
          return 4;
        default:
          return 5;
      }
    },
    getLocation(){
      if(!("geolocation" in navigator)) {
        this.errorStr = 'Geolocation is not available.';
        alert(this.errorStr);
        return;
      }
      this.gettingLocation = true;
      navigator.geolocation.getCurrentPosition(pos => {
        this.gettingLocation = false;
        this.location = pos;
      }, err => {
        this.gettingLocation = false;
        this.errorStr = err.message;
      })
    },
  },
  mounted(){
    this.getLocation();
  }
};
</script>
