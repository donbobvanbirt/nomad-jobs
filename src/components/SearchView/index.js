import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SearchBar, ButtonGroup, Badge } from 'react-native-elements';
import GiftedSpinner from 'react-native-gifted-spinner';

import JobList from './JobList';

import { requestJobs } from '../../actions';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    width: width - 100,
  },
  searchContainer: {
    // paddingTop: 5,
    // paddingBottom: 5,
  },
  searchIcon: {
    // paddingTop: 5,
  },
  spinnerContainer: {
    height: 500,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingTop: 12,
  },
  badge: {
    flexWrap: 'wrap',
  },
  searchButton: {
    width: 75,
    position: 'absolute',
    right: 5,
    top: -35,
  },
});

const searchItems = ['', 'dev', 'design', 'non tech'];

class Layout extends React.Component {
  state = {
    loading: true,
    searchQuery: '',
    search: '',
  }

  componentWillMount() {
    this.props.requestJobs();
  }

  componentWillReceiveProps(nextProps) {
    const { jobs } = nextProps;
    if (this.props.jobs !== jobs) {
      this.setState({ loading: false });
    }
  }

  handleSelect = (post) => {
    this.props.navigation.navigate('Post', { post });
  }

  handleSearch = (query) => {
    this.setState({ loading: true, searchQuery: query });
    const searchQuery = query ? `-${query.replace(' ', '-')}-` : '-';
    this.props.requestJobs(searchQuery);
  }

  handleType = (search) => {
    this.setState({ search });
  }

  render() {
    const { jobs } = this.props;
    const { loading, searchQuery, search } = this.state;
    const buttons = ['all jobs', 'dev jobs', 'UI/UX', 'non-tech'];

    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar
          round
          icon={{ style: styles.searchIcon }}
          containerStyle={styles.searchContainer}
          inputStyle={styles.searchInput}
          showLoadingIcon={false}
          onChangeText={this.handleType}
          placeholder="Search remote jobs..."
        />
        <Badge
          value="search"
          containerStyle={styles.searchButton}
          onPress={() => this.handleSearch(search)}
        />
        <ButtonGroup
          onPress={index => this.handleSearch(searchItems[index])}
          selectedIndex={searchItems.indexOf(searchQuery)}
          buttons={buttons}
        />
        {
          !!searchQuery &&
          <View style={styles.filterContainer}>
            <Text>filters: </Text>
            <Badge containerStyle={styles.badge} value={searchQuery} />
          </View>
        }
        {
          !loading ?
            <JobList jobs={jobs} handleSelect={this.handleSelect} /> :
            <View style={styles.spinnerContainer}>
              <GiftedSpinner />
            </View>
        }
      </ScrollView>
    );
  }
}

Layout.propTypes = {
  requestJobs: PropTypes.func.isRequired,
  jobs: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  jobs: state.jobs,
});

const mapDispatchToProps = dispatch => ({
  requestJobs(query) {
    dispatch(requestJobs(query));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
