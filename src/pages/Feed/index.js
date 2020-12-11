import React, { useState, useEffect, useCallback } from 'react';
import { Text ,Image, Animated, Modal ,StyleSheet, FlatList, Button , View, Icon, ScrollView, TextInput, TouchableWithoutFeedback} from 'react-native';
import axios from 'axios'
import { AsyncStorage } from 'react-native';
import { Colors, IconButton, Container, Post, Header, Avatar, Name, Description, Loading} from './styles';
import { AntDesign, Entypo } from '@expo/vector-icons';

export default function Feed() {
  const [error, setError] = useState('');
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewable, setViewable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [text, setText] = useState(''+'\n')
  const [idCurtida, setidCurtida] = useState('Curtidas:')
  const [idCurtidaComentario, setidCurtidaComentario] = useState(''+'\n')
  const [comentarios, setComentarios] = useState([])
  const [curtida, setCurtida] = useState ([])
  const [curtidacomentario, setCurtidaComentario] = useState ([])
  const [ListaCurtida, setListaCurtida] = useState(false);
  const [ListaComemtario, setListaComemtario] = useState(false);

  const MAX_LENGTH = 250;

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    if (pageNumber === total) return;
    if (loading) return;

    setLoading(true);
    //http://localhost:3000/feed?_expand=author&_limit=4&_page=1
    //utilizar server.js no jsonserver
    //https://5fa103ace21bab0016dfd97e.mockapi.io/api/v1/feed?page=1&limit=4
    //utilizar o server2.js no www.mockapi.io
    axios
    .get(`http://demo3691685.mockable.io/feedinstagram`)
    .then(response => {
      const totalItems = response.headers["x-total-count"]
      const data = response.data
      //console.log(data)
      setLoading(false)
      setTotal(Math.floor(totalItems / 4));
      setPage(pageNumber + 1);
      setFeed(shouldRefresh ? data : [...feed, ...data]);
    })
    .catch(err => {
      setError(err.message);
      setLoading(true)
    })
  }

  async function refreshList() {
    setRefreshing(true);
    
    await loadPage(1, true);

    setRefreshing(false);
  }

  const onGet = (id) => {
    try {

      const value = AsyncStorage.getItem(id);

      if (value !== null) {
        // We have data!!
        setComentarios(value)
      } 
    } catch (error) {
      // Error saving data
    }
  }

  const onSave = async (id) => {
    try {
      await AsyncStorage.setItem(id, text);
      setComentarios([...comentarios,...text])
    } catch (error) {
      // Error saving data
    }
  }
  const onSaveCurtida = async (author) => {
    try {
      await AsyncStorage.setItem(author, idCurtida);
      setCurtida([...curtida, ...idCurtida])
    } catch (error) {
      // Error saving data
    }
  }
  const onSaveCurtidComentario = async (author) => {
    try {
      await AsyncStorage.setItem(author, idCurtidaComentario);
      setCurtidaComentario([...curtidacomentario, ...idCurtidaComentario])
    } catch (error) {
      // Error saving data
    }
  }

  useEffect(() => {
    loadPage()
  }, []);

 

  const renderItem = ({item}) => {
    return (
      <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>
       
            <ScrollView
            pagingEnabled 
            horizontal
            showHorizontalScrollIndicator={false}
            aspectRatio={item.aspectRatio} 
            shouldLoad={viewable.includes(item.id)}               
            source={{uri: item.image }}>
             
            <Image
              aspectRatio={item.aspectRatio} 
              shouldLoad={viewable.includes(item.id)} 
              smallSource={{ uri: item.small }}
              source={{uri: item.image }}
                      
            />
            <Image
              aspectRatio={item.aspectRatio} 
              shouldLoad={viewable.includes(item.id)} 
              smallSource={{ uri: item.small }}
             
              source={{uri: item.image }}             
            />          
            </ScrollView>

            <Description>
              <Name>{item.author.name}</Name> {item.description}´ 
            </Description>  

          <View>
          <Modal
          animationType={'slide'}
          transparent={false}
          visible={ListaCurtida}
          onRequestClose={() => {
            setListaCurtida(Boolean(false));
          }}>
           <View >            
            <Button
              title="Curtidas:"
              onPress={() => {
                setListaCurtida(Boolean(false));
              }}
            />
             <Description>
              {curtida}
            </Description>  
            </View>
        </Modal>
        <Button
          title="Curtidas"
          onPress={() => {
            setListaCurtida(Boolean(true));
          }}/>
      </View>
          
      <View>
          <Modal
          animationType={'slide'}
          transparent={false}
          visible={ListaComemtario}
          onRequestClose={() => {
            setListaComemtario(Boolean(false));
          }}>
           <View >            
            <Button
              title="Comentarios:"
              onPress={() => {
                setListaComemtario(Boolean(false));
              }}
            />
             <Description>               
             {comentarios}{curtidacomentario}
            </Description>  
            </View>
            <TextInput
              multiline={true}
              onChangeText={(text) => setText(text)}
              placeholder={"Comentários"}
              style={[styles.text]}
              maxLength={MAX_LENGTH}
              value={text}/>
            <Button
              title="Comentar"
              onPress={() => onSave(String(item.id))}
              accessibilityLabel="Comentar">
            </Button>
        </Modal>
        <Button
          title="Comentarios"
          onPress={() => {
            setListaComemtario(Boolean(true));
          }}/>
      </View>
            <Description maxLength={2}>          
            {comentarios}
            <Button             
              title="Curtir Comentario"             
              onPress={() => onSaveCurtidComentario(String(item.author), setidCurtidaComentario(String(item.author.name+'\n')) )}                        
              />  
            </Description>
            <Button             
              title="Curtir"             
              onPress={() => onSaveCurtida(String(item.author), setidCurtida(String(' '+item.author.name)) )}                        
              />  
            <TextInput
              multiline={true}
              onChangeText={(text) => setText(text)}
              placeholder={"Comentários"}
              style={[styles.text]}
              maxLength={MAX_LENGTH}
              value={text}/>
              
            <Button
              title="Comentar"
              onPress={() => onSave(String(item.id))}
              accessibilityLabel="Salvar Comentario">
            </Button>
            
         
             
      </Post>
    )
  }
  
  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  return (
    <Container>
      <FlatList
        key="list"
        data={feed}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ListFooterComponent={loading && <Loading />}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 10,
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={refreshList}
        refreshing={refreshing}
        onEndReachedThreshold={0.1}
        onEndReached={() => loadPage()}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    lineHeight: 33,
    color: "#333333",
    padding: 16,
    paddingTop: 16,
    minHeight: 170,
    borderTopWidth: 1,
    borderColor: "rgba(212,211,211, 0.3)"
},
  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    shadowColor: '#f1f1f1',
    shadowOpacity: 0.3,
    
  },
  menu:{
    backgroundColor: '#00213b'
  }
})
