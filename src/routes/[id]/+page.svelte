<script lang="ts">
  import AlbumDetail from '$lib/components/AlbumDetail.svelte'
  import type {PageData} from './$types'

  let {data}: {data: PageData} = $props()
</script>

<svelte:head>
  <title>{data.album.title} - Anton Keks Photography</title>
  <meta name="description" content={data.album.description} />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="mb-8">
    <a href="/" class="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to All Albums
    </a>
  </div>

  <div class="bg-white rounded shadow-xl border border-gray-100 overflow-hidden">
    <AlbumDetail album={data.album} />
  </div>
</div>
