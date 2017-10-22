import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  ScrollView,
  // Dimensions,
} from 'react-native';
import { Button, Badge, Text } from 'react-native-elements';
import moment from 'moment';

// const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  companyName: {
    fontSize: 20,
  },
  description: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    flexWrap: 'wrap',
    marginRight: 3,
    marginTop: 5,
  },
  buttonContainer: {
    paddingBottom: 100,
  },
});

const PostView = ({ navigation }) => {
  if (!navigation.state.params.post) {
    return (
      <Text>error</Text>
    );
  }

  const {
    company,
    date,
    description,
    position,
    tags,
    // url
  } = navigation.state.params.post;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <Text h4>{position}</Text>
      <Text style={styles.companyName}>{company}</Text>
      <Text>{moment(date).fromNow()}</Text>
      <View style={styles.tagContainer}>
        {
          tags.map((tag, i) => (
            <Badge containerStyle={styles.badge} value={tag} key={`tag-${i}-${tag}`} />
          ))
        }
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="APPLY NOW"
        />
      </View>
    </ScrollView>
  );
};

PostView.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default PostView;
