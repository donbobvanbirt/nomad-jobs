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
  searchContainer: {},
  searchIcon: {},
  spinnerContainer: {
    height: 500,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  noMatches: {
    paddingLeft: 12,
    paddingTop: 12,
  },
  results: {
    fontWeight: '500',
  },
});

const searchItems = ['', 'dev', 'design', 'non tech'];

class Layout extends React.Component {
  state = {
    loading: true,
    search: '',
  }

  componentWillMount() {
    this.props.requestJobs();
  }

  componentWillReceiveProps(nextProps) {
    const { searchResults } = nextProps;
    if (this.props.searchResults !== searchResults) {
      this.setState({ loading: false });
    }
  }

  handleSelect = (post) => {
    this.props.navigation.navigate('Post', { post, search: this.handleSearch });
  }

  handleSearch = (query) => {
    this.setState({ loading: true });
    this.props.requestJobs(query);
  }

  handleType = (search) => {
    this.setState({ search });
  }

  render() {
    const { searchResults } = this.props;
    const { jobs, query = '' } = searchResults;
    const { loading, search } = this.state;
    const buttons = ['all jobs', 'dev jobs', 'design/UX', 'non-tech'];

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
          selectedIndex={searchItems.indexOf(query)}
          buttons={buttons}
        />
        {
          !loading && !!jobs.length &&
          <View style={styles.resultsContainer}>
            <Text style={styles.results}>{`${jobs.length} remote ${query} jobs:`}</Text>
          </View>
        }
        {
          loading ?
            <View style={styles.spinnerContainer}>
              <GiftedSpinner />
            </View>
            :
            jobs.length ?
              <JobList
                jobs={jobs}
                handleSelect={this.handleSelect}
              /> :
              <Text style={styles.noMatches}>no matches found</Text>
        }
      </ScrollView>
    );
  }
}

Layout.propTypes = {
  requestJobs: PropTypes.func.isRequired,
  searchResults: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  searchResults: state.searchResults,
});

const mapDispatchToProps = dispatch => ({
  requestJobs(query) {
    dispatch(requestJobs(query));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
