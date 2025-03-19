import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import classNames from "classnames/bind";
import styles from "./VideoPlayer.module.scss";

const cx = classNames.bind(styles);

const convertShortsToNormal = (shortURL) => shortURL.replace("youtube.com/shorts/", "youtube.com/watch?v=");

const videoList = [
  {
    url: "https://www.youtube.com/shorts/Bk6chf1iUWw",
    avatar: "https://i.pravatar.cc/150?img=2",
    likes: 1117,
    comments: 533,
  },
  {
    url: "https://www.youtube.com/shorts/A3WdBC5qtnM",
    avatar: "https://i.pravatar.cc/150?img=5",
    likes: 222456,
    comments: 310,
  },
  {
    url: "https://www.youtube.com/shorts/ckVb56BG0Zs",
    avatar: "https://i.pravatar.cc/150?img=9",
    likes: 3335777,
    comments: 755,
  },
].map((video) => ({
  ...video,
  url: convertShortsToNormal(video.url),
}));

const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showIcon, setShowIcon] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [videos, setVideos] = useState(videoList);
  const [isLiked, setIsLiked] = useState(Array(videoList.length).fill(false));
  const videoContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = (event) => {
      if (!isHovering || isLocked) return;

      setIsLocked(true);
      setTimeout(() => setIsLocked(false), 1500);

      event.preventDefault();
      setCurrentIndex((prev) =>
        event.deltaY > 0 ? (prev < videos.length - 1 ? prev + 1 : 0) : (prev > 0 ? prev - 1 : videos.length - 1)
      );
			setPlaying(true);
    };

    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [isHovering, isLocked, videos.length]);

  const togglePlay = () => {
    setPlaying((prev) => !prev);
    setShowIcon(playing ? "⏸" : "▶");
    setTimeout(() => setShowIcon(null), 800);
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    setMuted((prev) => !prev);
  };

	const formatNumber = (num) => {
		if (num >= 1_000_000) {
			return (num / 1_000_000).toFixed(1) + "M";
		} else if (num >= 1_000) {
			return (num / 1_000).toFixed(1) + "K";
		}
		return num;
	};	

  const handleLike = () => {
    setVideos((prevVideos) =>
      prevVideos.map((video, index) =>
        index === currentIndex
          ? { ...video, likes: isLiked[index] ? video.likes - 1 : video.likes + 1 }
          : video
      )
    );

    setIsLiked((prevLikes) => {
      const newLikes = [...prevLikes];
      newLikes[currentIndex] = !newLikes[currentIndex];
      return newLikes;
    });
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className={cx("pad-top")}>
      <div className={cx("video-feed")}>
        <div
          ref={videoContainerRef}
          className={cx("video-container")}
          onClick={togglePlay}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <ReactPlayer
            url={currentVideo.url}
            playing={playing}
            loop={true}
            muted={muted}
            controls={false}
            width="100%"
            height="100%"
            style={{ pointerEvents: "none" }}
          />

          {showIcon && <div className={cx("play-icon")}>{showIcon}</div>}

          <button className={cx("mute-btn")} onClick={toggleMute}>
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        <div className={cx("video-info")}>
          <div className={cx("avatar-container")}>
            <img src={currentVideo.avatar} alt="Avatar" className={cx("avatar")} />
            <button className={cx("follow-btn")}>Follow</button>
          </div>

          <div className={cx("actions")}>
            <button className={cx("action-btn", { liked: isLiked[currentIndex] })} onClick={handleLike}>
              <p className={cx("wd-radius")}>❤️</p>
              <p className={cx("name")}>{formatNumber(currentVideo.likes)}</p>
            </button>
            <button className={cx("action-btn")}>
              <p className={cx("wd-radius")}>💬</p>
              <p className={cx("name")}>{currentVideo.comments}</p>
            </button>
            <button className={cx("action-btn")}>
              <p className={cx("wd-radius")}>🔗</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
