import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useState } from 'react';

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

export function usePhotoGallery() {
    const [photos, setPhotos] = useState<UserPhoto[]>([]);

    const takePhoto = async () => {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      const fileName = Date.now() + '.jpeg';
      const newPhotos = [
        {
          filepath: fileName,
          webviewPath: photo.webPath,
        },
        ...photos,
      ];
      setPhotos(newPhotos);

      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    };
  
    return {
      photos,
      takePhoto,
    };
  }