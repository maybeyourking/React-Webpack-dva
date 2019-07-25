import axios from 'axios';
import baseUrl from './base';

export default {
    requestlogin () {
      console.log('api=>login')
      // axios.get(baseUrl + '/login')
      //   .then(data => {
      //     console.log(data)
      //   })
      return new Promise((resolve, reject) => {
        axios.get(baseUrl + '/login')
        .then(data => {
          resolve(data.data)
        })
      })
    }
  }