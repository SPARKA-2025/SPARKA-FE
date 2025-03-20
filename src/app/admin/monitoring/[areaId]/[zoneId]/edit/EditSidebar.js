"use client";

import { useRouter } from "next/navigation";
import CctvSpotEdit from "../../../../../_components/CctvSpot";
import Gateway from "../../../../../_components/Gateway";
import SlotBoxEdit from "../../../../../_components/SlotBox";

export default function EditSidebar({
  stateValue,
  onToogleClick,
  onDragStart,
  onInputSizeChange,
  onInputSizeBlur,
  activeBlock,
  onChangeBlockProp,
  partData,
  activePart = { column: 0, row: 0},
  onChangePart,
  onSubmit
}) {
  const router = useRouter()
  return (
    <div className="flex flex-col h-full w-[26%] min-w-52 border-r-2 border-gray-200 bg-white px-4 overflow-y-auto divide-y-2 divide-primary divide-opacity-10 text-primary">
      <div className="flex py-2 gap-x-2">
        <div
          onClick={() => router.back()}
          className="bg-rose-500 rounded-lg text-white font-semibold w-full text-center my-2 cursor-pointer"
        >
          Cancel
        </div>
        <div
          onClick={onSubmit}
          className="bg-primary rounded-lg text-white font-semibold w-full text-center my-2 cursor-pointer"
        >
          Save
        </div>
      </div>
      <div className="flex w-full justify-between py-2">
        <span>Part</span>
        <select
          value={activePart?.id || partData[0]?.id || 0}
          onChange={onChangePart}
          className={`bg-black bg-opacity-10 rounded-sm px-1`}
        >
          { partData?.length > 1 && partData?.map((part) => (
            <option key={part.id} value={part.id}>
              {part.nama}
            </option>
          ))}
        </select>
      </div>
      <div className="py-2">
        <span className="w-full text-primary text-lg font-semibold mb-2">
          Pengaturan Edit
        </span>
        <Setting
          stateValue={stateValue}
          activePart={activePart}
          onToogleClick={onToogleClick}
          onInputSizeChange={onInputSizeChange}
          onInputSizeBlur={onInputSizeBlur}
        />
      </div>
      <div className="py-2">
        <span className="w-full text-primary text-lg font-semibold my-2">
          Blok
        </span>
        <Block onDragStart={onDragStart} />
      </div>
      <div className="py-2">
        <span className="w-full text-primary text-lg font-semibold my-2">
          Properti
        </span>
        <BlockProps activeBlock={activeBlock} onChange={onChangeBlockProp} />
      </div>
    </div>
  );
}

function Setting({
  stateValue,
  onToogleClick,
  onInputSizeChange,
  onInputSizeBlur,
  activePart
}) {
  const { showCctv, deleteMode, } = stateValue;
  const { row, column } = activePart

  return (
    <div className="flex flex-col gap-y-2">
      <SizeSetting
        label={"Baris"}
        id="row"
        value={row}
        onInputSizeChange={onInputSizeChange}
        onInputSizeBlur={onInputSizeBlur}
      />
      <SizeSetting
        label={"Kolom"}
        id="column"
        value={column}
        onInputSizeChange={onInputSizeChange}
        onInputSizeBlur={onInputSizeBlur}
      />
      <ToogleSetting
        label="Tunjukan CCTV"
        name="showCctv"
        value={showCctv}
        onClick={onToogleClick}
      />
      <ToogleSetting
        label="Mode Hapus"
        name="deleteMode"
        value={deleteMode}
        onClick={onToogleClick}
      />
    </div>
  );
}

function Block({ onDragStart }) {
  return (
    <div className="grid grid-cols-2 bg-white-smoke rounded-lg py-4 place-content-center gap-y-6">
      <BlockElement
        label={"Parkir"}
        draggable
        onDragStart={onDragStart}
        id={"slot-new"}
      >
        <SlotBoxEdit />
      </BlockElement>
      <BlockElement
        label={"Cctv"}
        draggable
        onDragStart={onDragStart}
        id={"cctv-new"}
      >
        <CctvSpotEdit animate={false} />
      </BlockElement>
      <BlockElement
        label={"gerbang"}
        draggable
        onDragStart={onDragStart}
        id={"gateway-new"}
      >
        <Gateway borderPosition="x" text="T" />
      </BlockElement>
    </div>
  );
}

function SizeSetting({ id, label, value, onInputSizeChange, onInputSizeBlur }) {
  return (
    <div className="flex w-full justify-between h-fit text-primary font-medium">
      <span>{label}</span>
      <input
        id={id}
        value={value}
        className="text-right w-12 bg-black bg-opacity-10 rounded-sm px-1"
        onChange={onInputSizeChange}
        onBlur={onInputSizeBlur}
      ></input>
    </div>
  );
}

function ToogleSetting({ label, value = true, onClick, name }) {
  return (
    <div
      onClick={() => onClick(name, value)}
      className="flex w-full h-[20%] text-primary justify-between items-center relative cursor-pointer"
    >
      <span className="flex w-fit font-medium">{label}</span>
      <div
        className={`flex h-[80%] min-h-4 w-[14%] rounded-full items-center px-[1%] relative min-w-18 ${
          value ? "justify-end bg-primary" : "justify-start bg-slate-500"
        }`}
      >
        <div className="flex h-[80%] w-auto bg-white rounded-full aspect-square absolute"></div>
      </div>
    </div>
  );
}

function BlockElement({ id, label, children, draggable = false, onDragStart }) {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center relative">
      <div className="aspect-square flex relative min-w-fit h-full justify-center items-center">
        <div
          id={id}
          draggable={draggable}
          onDragStart={onDragStart}
          className="flex h-full w-full translate-x-0 translate-y-0 cursor-pointer"
        >
          {children}
        </div>
      </div>
      <span className="text-primary font-medium h-[20%] text-center mx-auto">
        {label}
      </span>
    </div>
  );
}

function BlockProps({ activeBlock, onChange }) {
  const id = activeBlock?.id;

  if (!id) {
    return <div>Kosong atau Tidak Valid</div>;
  }

  return (
    <div className="text-primary">
      {id?.includes("cctv") && (
        <CCTVProps
          activeId={id}
          angle={activeBlock?.angle || 0}
          url={activeBlock?.url || '?'}
          onChange={onChange}
        />
      )}
      {id?.includes("gateway") && (
        <GatewayProps
        activeId={id}
        direction={activeBlock?.direction || 'horizontal'}
        isCorner = {activeBlock?.isCorner || false}
        text={activeBlock?.text || ''}
        onChange={onChange}
        />
      )}
    </div>
  );
}


function CCTVProps({ activeId, angle, url, onChange }) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex w-full justify-between">
        <span>Angle</span>
        <input
          type="number"
          value={angle}
          min="0"
          max="360"
          onChange={(e) => onChange(activeId, {angle: e.target.value})}
          className="text-right w-12 bg-black bg-opacity-10 rounded-sm px-1"
        />
      </div>
      <div className="flex w-full justify-between">
        <span>URL</span>
        <input
          type="text"
          value={url}
          onChange={(e) => onChange(activeId, {url: e.target.value})}
          className="text-right w-12 bg-black bg-opacity-10 rounded-sm px-1"
        />
      </div>
    </div>
  );
}

function GatewayProps({ activeId, direction, text, onChange, isCorner }) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex w-full justify-between">
        <span>Direction</span>
        <select
          value={direction}
          onChange={(e) => onChange(activeId, {direction: e.target.value})}
          className={`bg-black bg-opacity-10 rounded-sm px-1 ${isCorner ? '' : 'cursor-not-allowed opacity-60' }`}
          disabled={ !isCorner }
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>
      <div className="flex w-full justify-between">
        <span>Text</span>
        <input
          type="text"
          value={text}
          onChange={(e) => onChange(activeId, {text: e.target.value})}
          className="text-right w-12 bg-black bg-opacity-10 rounded-sm px-1"
          />
      </div>
    </div>
  );
}
