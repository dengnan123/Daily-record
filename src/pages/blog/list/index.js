import React, { Component } from "react";
import { connect } from "dva";
import router from "umi/router";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import hljs from "highlight.js";
import marked from "marked";
// import PropTypes from "prop-types";
import { Row, Col, Card, Skeleton, Icon } from "antd";
import styles from "./index.less";

class FleetList extends Component {
  componentWillMount() {
    marked.setOptions({
      highlight: code => {
        return hljs.highlightAuto(code).value;
      }
    });
  }

  componentDidMount() {
    const { high } = this.props;
    window.scrollTo({
      top: high,
      behavior: "smooth"
    });
  }

  click = id => {
    const {
      dispatch,
      location: {
        query: { labels }
      },
      obj,
      titleObj
    } = this.props;
    var high = document.body.scrollTop || document.documentElement.scrollTop;
    let info = {};
    if (obj[parseInt(id, 10)]) {
      info = {
        body: obj[parseInt(id, 10)],
        title: titleObj[parseInt(id, 10)]
      };
    }
    dispatch({
      type: "indexModel/save",
      payload: {
        info,
        type: labels ? labels : "all",
        high
      }
    });
    let url = "/blog/detail?";
    if (labels) {
      url = `${url}labels=${labels}&`;
    }
    url = `${url}id=${id}`;
    router.push(url);
  };

  render() {
    const { loading, arr, list, innerWidth } = this.props;
    const isLoading = loading.effects["indexModel/getList"];
    return (
      // <div className={innerWidth < 450 ? null : styles.pageContent}>
      <div>
        <Skeleton loading={isLoading} active>
          <Row type="flex" justify="center">
            <Col span={24}>
              {list.map(value => {
                return (
                  <Card
                    key={value.id}
                    bordered={false}
                    title={value.title}
                    bordered={false}
                    className={styles.cardSpan}
                    headStyle={{ color: "#3863a0", borderBottom: 0 }}
                    onClick={() => {
                      this.click(value.number);
                    }}
                  >
                    <div className={styles.content}>
                      {value.body.slice(0, 65)}
                    </div>

                    <div className={styles.bottomDiv}>
                      <span>
                        <Icon type="schedule" />
                        <span className={styles.time}>
                          {moment(value.created_at).format(
                            "YYYY.MM.DD HH:mm:ss"
                          )}
                        </span>
                      </span>
                      <span className={styles.reply}>
                        <Icon type="message" />
                        <span className={styles.replySpan}>
                          {" "}
                          {value.comments}
                        </span>
                      </span>
                    </div>
                  </Card>
                );
              })}
            </Col>
          </Row>
        </Skeleton>
        {arr.map((value, index) => {
          return (
            <Skeleton loading={isLoading} active key={index}>
              {""}
            </Skeleton>
          );
        })}
      </div>
    );
  }
}

function indexStateToProps(state) {
  const { loading } = state;
  const {
    list,
    count,
    numberArr,
    type,
    obj,
    high,
    innerWidth,
    titleObj
  } = state.indexModel;
  const arr = Array(15).fill(0);
  return {
    loading,
    list,
    count,
    arr,
    numberArr,
    type,
    obj,
    high,
    innerWidth,
    titleObj
  };
}

export default connect(indexStateToProps)(FleetList);
