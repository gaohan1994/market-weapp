/**
 * @Author: Ghan
 * @Date: 2020-04-17 15:28:36
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-04-23 09:44:35
 */
import Taro, { useState, useEffect, useRouter } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import dayJs from "dayjs";
import "../product/index.less";
import "../topic/index.less";
import BaseItem from "../../component/item/BaseItem";
import api from "./api";
import { ResponseCode } from "../../common/request/config";
import { defaultImage } from "../../common/util/common";

const prefix = "topic";

function DonateDetail() {
  const [donateDetail, setDonateDetail] = useState({});
  const router = useRouter();
  useEffect(() => {
    const payload = {
      id: router.params.id
    };
    api.donateDetail(payload).then(response => {
      if (response.code === ResponseCode.success) {
        setDonateDetail(response.data);
      }
    });
  }, [router.params.id]);
  const images = donateDetail.pics || [];
  return (
    <View className={`${prefix}`}>
      <BaseItem
        avator={
          (donateDetail &&
            donateDetail.userinfo &&
            donateDetail.userinfo.avatarUrl) ||
          defaultImage
        }
        title={
          donateDetail &&
          donateDetail.userinfo &&
          donateDetail.userinfo.nickName
        }
        subTitle={`${dayJs(donateDetail.create_time || "").format(
          "YYYY.MM.DD"
        )} 发布`}
        isRenderContent={false}
      />
      <View className="at-article">
        <View className="at-article__h1" style="color: #F05065">
          {donateDetail.status === 2 ? "已接收" : "待接收"}
        </View>
        <View className="at-article__h1">{donateDetail.title}</View>
        <View className="at-article__content">
          <View className="at-article__section">
            <View className="at-article__p">{donateDetail.description}</View>
          </View>
        </View>
        {images.length > 0 && (
          <Swiper
            className="topic-swiper"
            indicatorColor="#999"
            indicatorActiveColor="#F05065"
            circular
            indicatorDots
            autoplay
          >
            {images.map((pic, index) => {
              return (
                <SwiperItem
                  key={`d${index}`}
                  className="topic-swiper-item"
                  style="background: #f6f6f6"
                  onClick={() => {
                    Taro.previewImage({
                      urls: images,
                      index: index
                    });
                  }}
                >
                  <View
                    className="topic-swiper-image"
                    style={`background-image: url(${pic})`}
                  />
                </SwiperItem>
              );
            })}
          </Swiper>
        )}
      </View>
    </View>
  );
}

export default DonateDetail;
