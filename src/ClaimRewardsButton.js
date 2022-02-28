import React from 'react';
import humanReadableSatoshis from './lib/human-readable-satoshis';
import SendCoinButton from './SendCoinButton';

const ClaimRewardsButton = ({
  account,
  vendor,
  balance,
  syncData,
  coin,
  tiptime,
  claimableAmount,
  checkTipTime,
}) => (
  <SendCoinButton
    account={account}
    vendor={vendor}
    balance={balance}
    syncData={syncData}
    coin={coin}
    isClaimRewardsOnly={true}
    tiptime={tiptime}
    checkTipTime={checkTipTime}
    className="claim-rewards-btn">
    <i className="fa fa-donate"></i> Claim {humanReadableSatoshis(Math.max(0, claimableAmount))} rewards
  </SendCoinButton>
);

export default ClaimRewardsButton;