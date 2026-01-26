<script lang="ts">
  import type {PageData} from './$types'
  import Map from '$lib/components/Map.svelte'
  import type {Album} from '$lib/album_loader'
  import snarkdown from 'snarkdown'
  import {fade, fly} from 'svelte/transition'
  import {pushState} from '$app/navigation'
  import {page} from '$app/state'

  let {data}: {data: PageData} = $props()
  let hoveredAlbum: Album | undefined = $state()
  let selectedAlbum = $derived((page.state as any).selectedAlbum || data.albums.find(a => a.id === page.url.searchParams.get('album')))

  function openAlbum(album: Album) {
    const url = new URL(page.url.href)
    url.searchParams.set('album', album.id)
    pushState(url.href, {selectedAlbum: album})
  }

  function closeAlbum() {
    const url = new URL(page.url.href)
    url.searchParams.delete('album')
    pushState(url.href, {})
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') closeAlbum()
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Anton Keks Photography</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <Map albums={data.albums} {hoveredAlbum} onalbumclick={openAlbum} class="col-span-full h-96 xl:col-start-4 lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-2 lg:h-full"/>

    {#each data.albums as album}
      <button
        onclick={() => openAlbum(album)}
        class="group relative overflow-hidden bg-gray-100 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl text-left w-full cursor-pointer"
        onmouseenter={() => hoveredAlbum = album}
        onmouseleave={() => hoveredAlbum = undefined}
      >
        <div class="aspect-square overflow-hidden">
          <img src={album.thumbnail} alt={album.title}
               class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110">
        </div>

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-90 transition-opacity group-hover:opacity-100">
          <h2 class="text-xl font-bold text-white leading-tight mb-1">{album.title}</h2>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-300">{album.date}</span>
          </div>
          {#if album.description}
            <p
              class="text-xs text-gray-400 mt-2 line-clamp-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {album.description}
            </p>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>

{#if selectedAlbum}
  <div
    transition:fade={{duration: 200}}
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md cursor-default"
    onclick={closeAlbum}
    onkeydown={e => (e.key === 'Enter' || e.key === ' ') && closeAlbum()}
    role="button"
    tabindex="-1"
    aria-label="Close overlay"
  >
    <div
      transition:fly={{y: 20, duration: 400}}
      class="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl relative cursor-auto text-left"
      onclick={e => e.stopPropagation()}
      onkeydown={e => e.stopPropagation()}
      role="document"
    >
      <div class="sticky top-0 bg-white/95 backdrop-blur-md z-20 px-6 py-6 md:px-12 md:py-10 border-b border-gray-100 flex items-center justify-between gap-4 rounded-t-3xl">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{selectedAlbum.title}</h2>
        <div class="flex items-center gap-2 md:gap-4">
          <a
            href={selectedAlbum.photosUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 group/topbtn whitespace-nowrap shadow-sm"
          >
            <span class="hidden sm:inline">View Photos</span>
            <span class="sm:hidden text-sm">Photos</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 ml-1 md:ml-2 transition-transform group-hover/topbtn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <button
            onclick={closeAlbum}
            class="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-50 rounded-full shadow-sm hover:scale-110 active:scale-95"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 md:p-12">
        <a
          href={selectedAlbum.photosUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="block group/thumb aspect-video mb-10 overflow-hidden rounded-2xl shadow-xl relative"
        >
          <img src={selectedAlbum.thumbnail} alt={selectedAlbum.title} class="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105" />
          <div class="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
            <div class="bg-white/90 p-4 rounded-full shadow-lg opacity-0 group-hover/thumb:opacity-100 transition-all scale-75 group-hover/thumb:scale-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </a>

        <article class="prose prose-slate lg:prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
          {@html snarkdown(selectedAlbum.fullDescription)}
        </article>

        <div class="mt-16 flex items-center justify-between gap-8 border-t border-gray-100 pt-10">
          <div class="text-gray-400 font-medium italic">
            {selectedAlbum.date}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
