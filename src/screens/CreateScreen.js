import React, { useState, useContext, useEffect } from 'react'
import { View, ScrollView, Text, TextInput } from 'react-native'
import { t } from 'react-native-tailwindcss'
import routes from '../constants/routes'
import { AntDesign } from '@expo/vector-icons'
import Header from '../components/Header'
import Button from '../components/Button'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { AuthContext } from '../AuthContext'
import * as mutations from '../graphql/mutations'
import * as queries from './../graphql/queries'
const CreateScreen = ({ route, navigation }) => {
  const { id } = route?.params || {}
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)
  const [formState, setFormState] = useState({})
  const headerProps = {
    navigation,
    title: id ? 'Edit Post' : 'Create Post',
    ...(id && { onDeletePost: () => deletePost() })
  }
  useEffect(() => {
    getPostByID()
  }, [id])

  //Delete Posts
  const deletePost = async () => {
    if (id) {
      try {
        await API.graphql(
          graphqlOperation(mutations.deletePost, {
            input: { id }
          })
        )
        setFormState({})
        navigation.navigate(routes.Home)
      } catch (err) {
        console.error('error Delete  Post:', err)
      }
    }
  }

  // Get Post By ID
  const getPostByID = async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(queries.getPost, {
          id
        })
      )
      setFormState(data.getPost)
    } catch (err) {
      console.log('error creating Posts:', err)
    }
  }

  // Submit it send the Data
  const handleSubmit = async () => {
    setLoading(true)
    // Edit Data
    if (id) {
      try {
        const { title, description } = formState
        await API.graphql(
          graphqlOperation(mutations.updatePost, {
            input: { id, title, description }
          })
        )
        setLoading(false)
        navigation.navigate(routes.Home)
      } catch (err) {
        setLoading(false)
        console.error('error creating updating Post:', err)
      }
    } else {
      // create Data
      try {
        const { title, description } = formState
        await API.graphql(
          graphqlOperation(mutations.createPost, {
            input: { title, description, owner: user.attributes?.email }
          })
        )
        setLoading(false)
        navigation.navigate(routes.Home)
      } catch (err) {
        console.log('error creating Posts:', err)
      }
    }
  }

  return (
    <View style={[t.flex1]}>
      <Header {...headerProps} />
      <ScrollView keyboardShouldPersistTaps='never' style={[t.flex1, t.p6]}>
        <Text style={[t.fontBold, t.text2xl]}>Title</Text>
        <TextInput
          value={formState.title}
          onChangeText={text => setFormState({ ...formState, title: text })}
          placeholder='Title here...'
          autoCapitalize='none'
          style={[t.border, t.p4, t.mT3, t.rounded, t.borderGray500, t.textLg]}
        />
        <Text style={[t.fontBold, t.text2xl, t.mT6]}>Description</Text>
        <TextInput
          value={formState.description}
          onChangeText={text =>
            setFormState({ ...formState, description: text })
          }
          autoCapitalize='none'
          placeholder='Description here...'
          multiline
          style={[
            t.border,
            t.pT4,
            t.p4,
            t.mT3,
            t.rounded,
            t.borderGray500,
            t.textLg,
            t.mB6,
            { minHeight: 200 }
          ]}
        />
        <Button loading={loading} onPress={handleSubmit}>
          <Text
            style={[
              t.textWhite,
              t.textXl,
              t.fontBold,
              t.textCenter,
              t.mR3,
              { lineHeight: 23 }
            ]}
          >
            Submit
          </Text>
          <AntDesign name='arrowright' size={24} color='white' />
        </Button>
      </ScrollView>
    </View>
  )
}

export default CreateScreen
