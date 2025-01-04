
export default interface IRoomTypeController {

  createRoomType(req: any, res: any, next: any): Promise<void>;

  getRoomTypes(req: any, res: any, next: any): Promise<void>;

  updateRoomType(req: any, res: any, next: any): Promise<void>;

}
