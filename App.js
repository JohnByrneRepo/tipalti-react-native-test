import * as React from 'react'
import { useState, useEffect } from 'react'
import { CheckBox, Text, View, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [products, setProducts] = useState([])

  const setStoredProducts = (jsonString) => {
    const storedProducts = JSON.parse(jsonString)
    const data = storedProducts.map(item => {
      let selected = false
      if (storedProducts.length > 0 && storedProducts.filter(s => s.id === item.id)[0].selected) selected = true
      return { ...item, selected }
    })
    setProducts(data)

  }

  const getData = async (json) => {
    try {
      const value = await AsyncStorage.getItem('@products')
      if (value !== null) {
        setStoredProducts(value)
      }
    } catch (e) {
      // error reading value
      setProducts(json.filter(s => {
        return { ...s, selected: false }
      }))
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json => {
          getData(json)
        })
    }
    fetchProducts()
  }, [])

  const storeData = async (updatedProducts) => {
    try {
      console.log('producst:' + JSON.stringify(updatedProducts[0]));
      const jsonValue = JSON.stringify(updatedProducts)
      await AsyncStorage.setItem('@products', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const handleSelection = (id, item) => {
    async function mockApiCall(id, checked) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve({
            message: `Saved! ${checked}`
          });
        }, 2000);
      });
    }
    mockApiCall(id, item.selected)

    const updatedProducts = products.map(p => {
      return p.id === id ? { ...p, selected: !p.selected } : p
    })

    setProducts(updatedProducts)
    storeData(updatedProducts)
  }

  return (
    <View style={styles.container}>
      {products.map((item, idx) => (
        <View key={idx} style={styles.checkboxContainer}>
          <CheckBox
            value={item.selected}
            onChange={(event) => handleSelection(item.id, item)}
            style={styles.checkbox}
          />
          <Text style={styles.label}>{item.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    height: 40,
    width: 300
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
