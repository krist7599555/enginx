<script>
  import DateItem from './DateItem.pug'
  import {events, _dates} from './store.js'
  import {fly, slide, fade} from 'svelte/transition'
  import _ from 'lodash'
  import Icon from './Fa.svelte'
  import {faCircleNotch} from '@fortawesome/free-solid-svg-icons'

  $: grpEvents = _.groupBy($events, 'date')
</script>


<div class="days dateItems">
  {#if $events}
    {#each _dates as date (date)}
      <div class="days-item" transition:slide={{duration: 1200, delay: 500}}>
          <DateItem date={date}></DateItem>
      </div>
    {/each}
  {:else}
    <div class="days-item" out:fade={{duration: 570}}>
      <p class='has-text-white'>loading
        <Icon icon={faCircleNotch} class='fa-spin' />
      </p>
    </div>
  {/if}
</div>

<style>

  .days
    display: flex
    width: 100%
    flex-wrap: nowrap
    overflow-x: auto
    -webkit-overflow-scrolling: touch
    > .days-item:not(:last-child)
      margin-right: 1rem
      flex: 0 0 auto

</style>
