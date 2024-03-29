import React, { useState } from "react"
import { AiFillInfoCircle, AiOutlineClear } from "react-icons/ai"
import { LiaCubesSolid } from "react-icons/lia"
import Modal from "react-responsive-modal"
import Button from "../../button"
import { FaMoneyBillTransfer, FaSpinner } from "react-icons/fa6"
import AddStakingForm from "../../forms/stake/add"
import TransferStakingForm from "../../forms/stake/transfer"
import UnstakingForm from "../../forms/stake/unstake"
import { ValidatorType } from "@/types"
import { useGetValidatorsByIdQuery } from "@/store/api/statsApi"
import { usePolkadot } from "@/context"

type IStakingModal = {
  open: boolean
  setOpen: (arg: boolean) => void
  validatorId?: string
}
const StakingModal = ({ open, setOpen, validatorId }: IStakingModal) => {
  const [selectedOperation, setSelectedOperation] = useState("add")
  const { selectedAccount } = usePolkadot()
  const { data: validatorData, isLoading: validatorLoading } =
    useGetValidatorsByIdQuery({
      key: validatorId
        ? validatorId
        : String(process.env.NEXT_PUBLIC_COMSWAP_VALIDATOR),
      wallet: String(selectedAccount?.address),
    })
  return (
    <Modal open={open} onClose={() => setOpen(false)} center>
      <h1 className="text-lg font-semibold leading-8">Manage Stake</h1>
      <hr />
      <div className="w-full">
        <div className="my-3">
          {validatorLoading && <FaSpinner className="spinner" />}
          {!validatorLoading && (
            <div className="border-[2px] my-5 p-4 text-sm rounded-lg shadow-card">
              <div className="flex justify-between">
                <h6 className=" text-base tracking-tight font-semibold flex items-center">
                  <LiaCubesSolid size={40} /> Validator Details
                </h6>
              </div>
              <hr className="my-2" />
              <ul>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">Name</h6>
                  <h1 className="font-normal w-1/2">{validatorData?.name}</h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">
                    Total Staked{" "}
                  </h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {Number(validatorData?.stake) / 10 ** 9} COMAI
                  </h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">
                    Total Stakers{" "}
                  </h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {validatorData?.total_stakers}
                  </h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">APY </h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {validatorData?.apy?.toFixed(2)}%
                  </h1>
                </li>
                <li className="flex gap-x-2 pb-1">
                  <h6 className="font-normal w-1/2 tracking-tighter">Fees</h6>
                  <h1 className="font-normal w-1/2 tracking-tighter">
                    {validatorData?.delegation_fee}%
                  </h1>
                </li>
              </ul>
            </div>
          )}
          {validatorData?.wallet_staked !== 0 && (
            <div className="flex p-3 rounded-2xl bg-green-100 items-center justify-between">
              <h5 className="text-sm font-semibold flex items-center gap-x-3">
                <AiFillInfoCircle />
                You have staked $
                {Number(validatorData?.wallet_staked) / 10 ** 9} COMAI here.
              </h5>
            </div>
          )}
        </div>
        <div className="flex py-2 flex-col gap-y-3  justify-between sm:flex-row sm:gap-x-3">
          <Button
            variant="outlined"
            prefix={<FaMoneyBillTransfer />}
            size="small"
            className={`${
              selectedOperation === "add" ? "!bg-button !text-white" : ""
            }`}
            onClick={() => setSelectedOperation("add")}
          >
            Add Stake
          </Button>
          {validatorData?.wallet_staked !== 0 && (
            <Button
              variant="outlined"
              prefix={<FaMoneyBillTransfer />}
              size="small"
              className={`${
                selectedOperation === "transfer" ? "!bg-button !text-white" : ""
              }`}
              onClick={() => setSelectedOperation("transfer")}
            >
              Transfer Stake
            </Button>
          )}
          {validatorData?.wallet_staked !== 0 && (
            <Button
              variant="outlined"
              size="small"
              prefix={<AiOutlineClear />}
              className={`${
                selectedOperation === "unstake" ? "!bg-button !text-white" : ""
              }`}
              onClick={() => setSelectedOperation("unstake")}
            >
              Unstake
            </Button>
          )}
        </div>
        <div className="pt-4">
          {selectedOperation === "add" && (
            <AddStakingForm validator={validatorData} />
          )}

          {selectedOperation === "transfer" && (
            <TransferStakingForm validator={validatorData} />
          )}
          {selectedOperation === "unstake" && (
            <UnstakingForm validator={validatorData} />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default StakingModal
