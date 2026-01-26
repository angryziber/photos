<script lang="ts">
  import {onMount} from 'svelte'
  import type {Album} from '$lib/album_loader'

  let {albums, class: className, hoveredAlbum, onalbumclick}: {
    albums: Album[],
    class?: string,
    hoveredAlbum?: Album,
    onalbumclick?: (album: Album) => void
  } = $props()

  let mapElement: HTMLElement
  let map: google.maps.Map

  const initialZoom = 1.5
  const initialCenter = {lat: 20, lng: 0}

  onMount(() => {
    if ((window as any).google?.maps) {
      initMap()
      return
    }

    (window as any).initMap = initMap
    const key = 'AIzaSyBgn7wSYI8l-JD1X2LAJUqIUfWX9ezLoIA'
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
    script.async = true
    script.defer = true

    document.head.appendChild(script)
  })

  $effect(() => {
    if (!map) return
    if (hoveredAlbum?.lat !== undefined && hoveredAlbum?.lng !== undefined) {
      map.setZoom(4)
      map.panTo(hoveredAlbum as google.maps.LatLngLiteral)
    } else {
      map.setZoom(initialZoom)
      map.panTo(initialCenter)
    }
  })

  function initMap() {
    map = new google.maps.Map(mapElement, {
      zoom: 1.5,
      center: {lat: 20, lng: 0},
      mapTypeId: google.maps.MapTypeId.HYBRID,
      streetViewControl: false,
      zoomControl: false,
      panControl: false,
      mapTypeControl: false,
      backgroundColor: '#3e5e89',
    })

    albums.filter(a => a.lat !== undefined && a.lng !== undefined).forEach(album => {
      const marker = new google.maps.Marker({
        position: album as google.maps.LatLngLiteral,
        map,
        title: album.title,
      })

      marker.addListener('click', () => {
        onalbumclick?.(album)
      })
    })
  }
</script>

<div class="w-full overflow-hidden shadow-md {className}" bind:this={mapElement}></div>
