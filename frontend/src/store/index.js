import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    songs: [],
    playlists: [],
    currentPlaylist: null,
    isLoading: false,
    error: null
  },
  
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    clearAuth(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    setSongs(state, songs) {
      state.songs = songs
    },
    setPlaylists(state, playlists) {
      state.playlists = playlists
    },
    setCurrentPlaylist(state, playlist) {
      state.currentPlaylist = playlist
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setError(state, error) {
      state.error = error
    }
  },
  
  actions: {
    // Autenticação
    async register({ commit }, userData) {
      try {
        commit('setLoading', true)
        const response = await axios.post('/users/register', userData)
        commit('setLoading', false)
        return response.data
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao registrar')
        throw error
      }
    },
    
    async login({ commit }, credentials) {
      try {
        commit('setLoading', true)
        const response = await axios.post('/users/login', credentials)
        commit('setUser', response.data.user)
        commit('setToken', response.data.token)
        commit('setLoading', false)
        return response.data
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao fazer login')
        throw error
      }
    },
    
    logout({ commit }) {
      commit('clearAuth')
      // Redirecionar para a página de login
    },
    
    async fetchUserProfile({ commit }) {
      try {
        commit('setLoading', true)
        const response = await axios.get('/users/profile')
        commit('setUser', response.data.user)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao buscar perfil')
        throw error
      }
    },
    
    // Músicas
    async fetchAllSongs({ commit }) {
      try {
        commit('setLoading', true)
        const response = await axios.get('/songs')
        commit('setSongs', response.data.songs)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao buscar músicas')
        throw error
      }
    },
    
    // Playlists
    async fetchUserPlaylists({ commit }) {
      try {
        commit('setLoading', true)
        const response = await axios.get('/playlists')
        commit('setPlaylists', response.data.playlists)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao buscar playlists')
        throw error
      }
    },
    
    async fetchPlaylistById({ commit }, playlistId) {
      try {
        commit('setLoading', true)
        const response = await axios.get(`/playlists/${playlistId}`)
        commit('setCurrentPlaylist', response.data)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao buscar playlist')
        throw error
      }
    },
    
    async createPlaylist({ commit, dispatch }, playlistData) {
      try {
        commit('setLoading', true)
        await axios.post('/playlists', playlistData)
        dispatch('fetchUserPlaylists') // Recarrega playlists após criar
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao criar playlist')
        throw error
      }
    },
    
    async addSongToPlaylist({ commit, dispatch }, { playlistId, songId }) {
      try {
        commit('setLoading', true)
        await axios.post(`/playlists/${playlistId}/songs`, { songId })
        dispatch('fetchPlaylistById', playlistId) // Recarrega a playlist atual
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao adicionar música')
        throw error
      }
    },
    
    async removeSongFromPlaylist({ commit, dispatch }, { playlistId, songId }) {
      try {
        commit('setLoading', true)
        await axios.delete(`/playlists/${playlistId}/songs/${songId}`)
        dispatch('fetchPlaylistById', playlistId) // Recarrega a playlist atual
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response ? error.response.data.message : 'Erro ao remover música')
        throw error
      }
    }
  },
  
  getters: {
    isAuthenticated(state) {
      return !!state.token
    },
    getUser(state) {
      return state.user
    },
    getAllSongs(state) {
      return state.songs
    },
    getUserPlaylists(state) {
      return state.playlists
    },
    getCurrentPlaylist(state) {
      return state.currentPlaylist
    },
    isLoading(state) {
      return state.isLoading
    },
    getError(state) {
      return state.error
    }
  }
})

