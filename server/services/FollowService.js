import FollowerRepository from '../repositories/FollowerRepository.js';

class FollowService {
  constructor(followerRepository){
    this.followerRepository = followerRepository;
  }

  async getFollowStats(userId) {
    const { followingUsersIds} = await this.followerRepository.getFollowing(userId);
    const followers = await this.followerRepository.getFollowers(userId);

    const stats = {
      followingCount: followingUsersIds.length,
      followersCount: followers.length,
    };

    return stats;
  }
}

export default new FollowService(FollowerRepository);
