import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import {getArticleList} from './api';

class Data extends React.Component {

  constructor() {
    super()
    //Init an empty state
    //articles -> has a list of all articles
    //currentArticle -> the current article being shown in detail
    this.state = {
      articles: [],
      isLoading: false
    };
  }

  componentDidMount() {
    //Fetch the list of articles from the DB using the Hasura data apis
    this.setState({
      ...this.state,
      isLoading: true
    })
    getArticleList().then(articleList => {
      //Update the state with the fetched articles
      this.setState((prevState) => ({
        isLoading: false,
        articles: articleList
      }));
    });
  }

  render() {
    return (
      <div>
        <Card>
          <CardText>
            This component utilizes the hasura data APIs. In this example, it fetches a list of articles from the articles table which has been pre created and already loaded with some dummy data. To check out how the data API is used to render this view, check out services/ui/app/src/hasuraExamples/Data.js. A good exercise would be to also show the author details for each of these articles. 
          </CardText>
        </Card>
        <h1>Articles</h1>
        <Divider/>
        {this.state.articles.map((article, i) =>
          <div key={i}>
            <Card style={articleCardStyle}>
              <CardTitle titleStyle='bold' title={article.title}/>
              <CardText
                color='#BF000000'>
                {article.content}
              </CardText>
            </Card>
          </div>
        )}
      </div>
    );
  }
}

const articleCardStyle = {
  padding: '20px',
  margin: '20px'
};

export {
  Data
};
