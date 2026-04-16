<script lang="ts">
  import type {Album} from '$lib/album_loader'
  import snarkdown from 'snarkdown'
  import RightArrowIcon from './RightArrowIcon.svelte'
  import ThumbIcon from './ThumbIcon.svelte'

  let {album, showClose = false, onclose}: {
    album: Album,
    showClose?: boolean,
    onclose?: () => void
  } = $props()
</script>

<div class="sticky top-0 bg-white/95 backdrop-blur-md z-20 p-6 md:px-10 border-b border-gray-100 flex items-center justify-between gap-4 rounded-t-3xl">
  <h2 class="text-2xl font-bold text-gray-900 leading-tight">{album.title}</h2>
  <div class="flex items-center gap-2 md:gap-4">
    <a href={album.photosUrl} rel="noopener noreferrer"
       class="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 group/topbtn whitespace-nowrap shadow-sm">
      <span class="hidden sm:inline">View Photos</span>
      <span class="sm:hidden text-sm">Photos</span>
      <RightArrowIcon class="group-hover/topbtn:translate-x-1"/>
    </a>
    {#if showClose}
      <button onclick={onclose} title="Close"
              class="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-50 rounded-full shadow-sm hover:scale-110 active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>
</div>

<div class="flex-1 overflow-y-auto p-6 md:p-10">
  <a href={album.photosUrl} rel="noopener noreferrer"
     class="block group/thumb aspect-video mb-10 overflow-hidden rounded shadow-xl relative">
    <img src={album.thumbnail} alt={album.title} class="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105">
    <div class="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
      <div class="bg-white/90 p-4 rounded-full shadow-lg opacity-0 group-hover/thumb:opacity-100 transition-all scale-75 group-hover/thumb:scale-100">
        <ThumbIcon/>
      </div>
    </div>
  </a>

  <article class="prose prose-slate lg:prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
    {@html snarkdown(album.fullDescription)}
  </article>

  <div class="mt-16 flex items-center justify-between gap-8 border-t border-gray-100 pt-10 font-medium text-gray-400">
    <div class=" italic">
      {album.date}
    </div>
    <div>
      Anton Keks
    </div>
  </div>
</div>
