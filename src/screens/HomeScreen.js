import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager
} from 'react-native'
import { t, color } from 'react-native-tailwindcss'
import Ripple from 'react-native-material-ripple'
import { AntDesign } from '@expo/vector-icons'
import { GRADIENT_COLORS } from '../constants/colors'
import Header from '../components/Header'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { AuthContext } from '../AuthContext'
import * as queries from './../graphql/queries'
import routes from '../constants/routes'
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Item = ({ title, description, editable, navigation, id }) => {
  const [fullView, setFullView] = useState(false)

  return (
    <TouchableOpacity
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        setFullView(prev => !prev)
      }}
      activeOpacity={0.8}
      style={[t.p4, t.mB3, t.roundedLg, t.shadowMd, t.bgGray100]}
    >
      <View style={[t.flexRow, t.justifyBetween]}>
        <Text style={[t.textXl, t.mB3, t.fontBold, t.textBlue900]}>
          {title}
        </Text>
        {editable && (
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateScreen', { id })}
            style={[t.pX2]}
          >
            <AntDesign name='edit' size={20} color={color.gray900} />
          </TouchableOpacity>
        )}
      </View>
      <Text
        style={[t.textBase, t.mB3, t.textGray800]}
        numberOfLines={fullView ? 0 : 2}
      >
        {description}
      </Text>
    </TouchableOpacity>
  )
}

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [Data, setData] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [Data])
  async function fetchPosts () {
    try {
      const { data } = await API.graphql(graphqlOperation(queries.listPosts))
      setData(data?.listPosts?.items)
    } catch (err) {
      console.error(err, 'error fetching todo')
    }
  }

  return (
    <View style={[t.flex1]}>
      <Header navigation={navigation} title='Blog Posts' />
      <View style={t.flex1}>
        <Text
          style={[t.mL5, t.mT5, t.mB3, t.textBlue900, t.fontBold, t.textXl]}
        >
          Hello {user.username}
        </Text>
        <FlatList
          contentContainerStyle={[t.p5]}
          data={Data}
          renderItem={({ item }) => (
            <Item
              id={item.id}
              navigation={navigation}
              editable={user.attributes.email === item.owner}
              description={item.description}
              title={item.title}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
}

export default HomeScreen
