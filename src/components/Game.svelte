<script>
  import Peer from '../p2p-client'
  import * as GL from '@sveltejs/gl';
  import Cell from './Cell.svelte'
  import PanWalkControls from '../controls/PanWalkControls.svelte'
  import Player from './Player.svelte'
  import PeerPlayer from './PeerPlayer.svelte'

  let brokerUrl = 'wss://webrtc-p2p-broker.herokuapp.com/'
  let hosting = true
  let brokerSession = null

  if (window.location.search) {
    let params = window.location.search.substring(1).split('&')
    for (let i = 0; i < params.length; i++) {
      if (params[i].match('^webrtc-session')) {
        brokerSession = params[i].split('=')[1]
        hosting = false
      } else if (params[i].match('^webrtc-broker')) {
        brokerUrl = params[i].split('=')[1]
      }
    }
  }

  const peer = new Peer(brokerUrl, {video: false, audio: false})
  const connections = {}

  peer.onconnection = connection => {
    console.log('connected: ' + connection.id)
    connections[connection.id] = connection
    connection.ondisconnect = () => {
      console.log('disconnected: ' + connection.id)
      delete connections[connection.id]
    }
    connection.onerror = error => console.error(error)
  }

  $: console.log(connections)

  peer.onerror = error => console.error(error)

  console.log(peer)

  let connectionAddress = ""

  if (hosting) {
    peer.listen({metadata:{name:'lizard.pictures'}})
    peer.onroute = route => {
      console.log(`route: ${route}`)
      let url = window.location.toString().split('?')
      url[1] = url[1] || '';
      let params = url[1].split('&')
      params.push(`webrtc-session=${route}`)
      params = params.filter(v => v)
      url[1] = params.join('&')
      
      connectionAddress = url.join('?')
    }
  } else {
    peer.connect(brokerSession)
  }


</script>

{#if connectionAddress}
<a href={connectionAddress} target="_blank">Connect</a>
{/if}

<GL.Scene>
	<GL.AmbientLight intensity={0.1}/>

  <Player connections={connections} />

  {#each Object.values(connections) as connection (connection.id)}
    <PeerPlayer connection={connection} />
  {/each}
  
	<Cell north west light="north" x=0 y=0/>
	<Cell north east x=1 y=0/>
	<Cell east x=1 y=1/>
	<Cell east x=1 y=2/>
	<Cell east x=1 y=3/>
	<Cell east x=1 y=4/>
	<Cell east x=1 y=5/>
  <Cell west x=0 y=1/>
	<Cell west x=0 y=2/>
	<Cell west x=0 y=3/>
	<Cell west x=0 y=4/>
	<Cell west x=0 y=5/>
	<Cell south west x=0 y=6/>
	<Cell south east light="south" x=1 y=6/>
</GL.Scene>