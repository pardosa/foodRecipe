import React, { Component } from 'react';
import { Dimensions, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import { Button, Divider, Input, Block, Text } from '../components';
import { theme, mocks } from '../constants';

const { width, height } = Dimensions.get('window');

const Product = props => {
  const navigation = props.navigation;
  const product = navigation.getParam('recipe');

  const renderGallery = () => {
    
    return (
      <Image
            source={{uri:product.image}}
            resizeMode="contain"
            style={{ width, height: height / 2.8 }}
          />
    );
  }

  
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderGallery()}

        <Block style={styles.product}>
          <Text h1 bold>{product.label}</Text>
          <Block flex={false} row margin={[theme.sizes.base * 0.8, 0]}>
          <FlatList
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            data={product.healthLabels}
            keyExtractor={(item, index) => `tag-${index}`}
            renderItem={({item}) => (
              <Text caption gray style={styles.tag}>
              {item}
            </Text>
            )}
          />
            
          </Block>
          <Divider margin={[theme.sizes.padding * 0.2, 0]} />
          <Block>
            <Text h3>Ingredients:</Text>
            {product.ingredientLines.map(label => (
              <Text key={`label-${label}`}>
                {label}
              </Text>
            ))}
          </Block>
          
          <Divider margin={[theme.sizes.padding * 0.9, 0]} />
          
          <Block>
            {/* <Text semibold>Gallery</Text> */}
            {/* <Block row margin={[theme.sizes.padding * 0.9, 0]}>
              {product.images.slice(1, 3).map(
                (image, index) => (
                  <Image
                    key={`gallery-${index}`}
                    source={image}
                    style={styles.image}
                  />
                )
              )}
              <Block
                flex={false}
                card
                center
                middle
                color="rgba(197,204,214,0.20)"
                style={styles.more}
              >
                
              </Block>
            </Block> */}
          </Block>
        </Block>
      </ScrollView>
    )
  
}

export default Product;

const styles = StyleSheet.create({
  product: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingVertical: theme.sizes.padding,
  },
  tag: {
    borderColor: theme.colors.gray2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.sizes.base,
    paddingHorizontal: theme.sizes.base,
    paddingVertical: theme.sizes.base / 2.5,
    marginRight: theme.sizes.base * 0.625,
  },
  image: {
    width: width / 3.26,
    height: width / 3.26,
    marginRight: theme.sizes.base,
  },
  more: {
    width: 55,
    height: 55,
  }
})
