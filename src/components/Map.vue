<template>
  <div>
    <div
    ref="map2"
    style="width:100%;height:100%"
    />
  </div>
</template>
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6f428547f8ff26402d2ede8daa8b240c&autoload=false"></script>
<script>

  export default {
    name: 'Map',

    components:{
      
    },
    
    props: {
      getStoresByGeoParent: {type: Function},
      showSellerInfo:{},
    },

    data: () => ({
      appKey: '6f428547f8ff26402d2ede8daa8b240c',
      center: {lat:33.450701, lng:126.570667},
      level: 4, 
      libraries: [],
      map: null,
      centerMarker:null,
      centerCircle:null,
      markerArray:[],

      location:null,
      gettingLocation: false,
      errorStr:null,
    }),

    
    mounted:function(){
      let kakaomapScript = document.createElement('script');
      kakaomapScript.setAttribute('src', '//dapi.kakao.com/v2/maps/sdk.js?appkey=6f428547f8ff26402d2ede8daa8b240c&autoload=false');
      document.head.appendChild(kakaomapScript);
      
      var ref=this;
      document.onreadystatechange = () => {
        if (document.readyState == "complete") {
          kakao.maps.load(function() {
            ref.loadMap();
          });
        }
      }
      this.getLocation();
    },

    watch: {
      showSellerInfo(bool) {
        this.$forceUpdate();
      }
    },

    methods: {
      loadMap:function(){
      var option = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3, 
      };
      var map=new kakao.maps.Map(this.$refs.map2,option);
      this.map= map;
      this.onLoad(map);
      },
      getStoresByGeo(a,b){
        this.getStoresByGeoParent(a,b);
      },
      // 지도가 로드 완료되면 load 이벤트 발생
      onLoad (map) {
        //this.map = map;
        map.setMaxLevel(7);
        if(this.location){
          this.setCenter();
        }
        var ref=this;

        var startLat,startLng,startLevel;
        kakao.maps.event.addListener(map, 'dragend', function() {
          ref.getStoresByGeo(map.getCenter().getLat(),map.getCenter().getLng());
        });

        kakao.maps.event.addListener(map, 'zoom_start', function() {
          startLat=map.getCenter().getLat();
          startLng=map.getCenter().getLng();
          startLevel=map.getLevel();
        });

        kakao.maps.event.addListener(map, 'zoom_changed', function() {
          if(map.getLevel()>startLevel)
            map.setCenter(new kakao.maps.LatLng(startLat,startLng));
          else
            ref.getStoresByGeo(map.getCenter().getLat(),map.getCenter().getLng());
        });
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
          if(this.map) this.setCenter();
        }, err => {
          this.gettingLocation = false;
          this.errorStr = err.message;
        })
      },

      setCenter: function(){
        if(this.gettingLocation) return;
        if(this.centerMarker) this.centerMarker.setMap(null);
        this.map.setLevel(4);
        this.map.setCenter(new kakao.maps.LatLng(this.location.coords.latitude,this.location.coords.longitude));
        var imageSrc = require('@/assets/person_pin_24px_red.svg'),  
            imageSize = new kakao.maps.Size(36, 36);
        var markerImage = new kakao.maps.MarkerImage(imageSrc,imageSize,{});
        this.centerMarker = new kakao.maps.Marker({ 
          position: this.map.getCenter(),
          image: markerImage
        });
        this.centerMarker.setMap(this.map);
        this.getStoresByGeo(this.map.getCenter().getLat(),this.map.getCenter().getLng());
      },
    },
    
    

  }
</script>
