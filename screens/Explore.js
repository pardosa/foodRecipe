import React, { useState, useEffect } from 'react'
import { Animated, Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, h4 } from 'react-native'
import { LinearGradient } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import { Button, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';

const { width, height } = Dimensions.get('window');

const Explore = props => {
  //Register to edamam to get app_id and app_key
  const APP_ID = "your_app_id";
  const APP_KEY = "your_app_key ";

  const [searchFocus, setSearchFocus] = useState(new Animated.Value(0.6));
  const [searchString, setSearchString] = useState(null);
  const [query, setQuery] = useState('banana');
  const [recipes, setRecipes] = useState([]);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  const navigation = props.navigation;

  useEffect(() => {
    getRecipes();
  }, [query]);

  const getRecipes = async () => {
    const response = await fetch(
      `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const data = await response.json();
    setRecipes(data.hits);
  };

  const searchRecipe = () => {
    setQuery(searchString);
  }

  const handleSearchFocus = status => {
    //setSearchFocus(status ? 0.8 : 0.6); // status === true, increase flex size
    Animated.timing(
      searchFocus, {
        toValue: status ? 0.8 : 0.6, 
        duration: 150, // ms
      }
    ).start();
  }

  const renderSearch = () => {
    
    const isEditing = searchFocus && searchString;
    
    return (
      <Block animated middle flex={searchFocus} style={styles.search}>
        <Input
          placeholder="Search"
          placeholderTextColor={theme.colors.gray2}
          style={styles.searchInput}
          onFocus={() => handleSearchFocus(true)}
          onBlur={() => handleSearchFocus(false)}
          onChangeText={text => setSearchString(text)}
          value={searchString}
          onRightPress={() => isEditing ? setSearchString(null) : null}
          rightStyle={styles.searchRight}
          rightLabel={
            <FontAwesome
              name={isEditing ? "close" : "search"}
              size={theme.sizes.base / 1.8}
              color={theme.colors.gray2}
              style={styles.searchIcon}
            />
          }
          onSubmitEditing={searchRecipe}
        />
      </Block>
    )
  }

  const renderImage = (item, index) => {
    const img = item.image;
    Image.getSize(img, (width, height) => {setImgWidth(width); setImgHeight(height)});
    const fullWidth = width - (theme.sizes.padding * 2.5);
    const resize = (imgWidth * 100) / fullWidth;
    const imageWidth = resize > 75 ? fullWidth : imgWidth * 1;

    return (
      <TouchableOpacity
        key={`img-${index}`}
        onPress={() => navigation.navigate('Product', {recipe: item})}
      > 
        <Text center h2>{item.label}</Text>
        <Image
          source={{uri: img}}
          style={[
            styles.image,
            { minWidth: imageWidth, maxWidth: imageWidth }
          ]}
        />
      </TouchableOpacity>
    )
  }

  const renderExplore = () => {

    if (recipes.length > 0){

      return (
        <Block style={{ marginBottom: height / 3 }}>
          <Block row space="between" wrap>
            {
              recipes.map((item, index) => renderImage(item.recipe, index))
            }
          </Block>
        </Block>
      )
    }else{
      return null;
    }
  }

  const renderFooter = () => {
    return (
      <LinearGradient
        locations={[0.5, 1]}
        style={styles.footer}
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)']}
      >
        <Button gradient style={{ width: width / 2.678 }}>
          <Text bold white center>Filter</Text>
        </Button>
      </LinearGradient>
    )
  }
  
  return (
    <Block>
      <Block flex={false} row center space="between" style={styles.header}>
        <Text h1 bold>Explore</Text>
        {renderSearch()}
      </Block>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.explore}>
        {renderExplore()}
      </ScrollView>

      {/* {renderFooter()} */}
    </Block>
  )
}

Explore.defaultProps = {
  images: mocks.explore,
};

export default Explore;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base * 2
  },
  search: {
    height: theme.sizes.base * 2,
    width: width - theme.sizes.base * 2,
  },
  searchInput: {
    fontSize: theme.sizes.caption,
    height: theme.sizes.base * 2,
    backgroundColor: 'rgba(142, 142, 147, 0.06)',
    borderColor: 'rgba(142, 142, 147, 0.06)',
    paddingLeft: theme.sizes.base / 1.333,
    paddingRight: theme.sizes.base * 1.5,
  },
  searchRight: {
    top: 0,
    marginVertical: 0,
    backgroundColor: 'transparent'
  },
  searchIcon: {
    position: 'absolute',
    right: theme.sizes.base / 1.333,
    top: theme.sizes.base / 1.6,
  },
  explore: {
    marginHorizontal: theme.sizes.padding * 1.25,
  },
  image: {
    minHeight: 100,
    maxHeight: 130,
    maxWidth: width - (theme.sizes.padding * 2.5),
    marginBottom: theme.sizes.base,
    borderRadius: 4,
  },
  mainImage: {
    minWidth: width - (theme.sizes.padding * 2.5),
    minHeight: width - (theme.sizes.padding * 2.5),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.1,
    width,
    paddingBottom: theme.sizes.base * 4,
  }
})
