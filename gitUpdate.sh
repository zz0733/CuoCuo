#! /bin/sh
zipFile="assets"
outName="asset"
gitPath="/Users/youle/CuoCuo/project"
sourcePath="/Users/youle/Desktop/project"


echo ${sourcePath}
cd ${sourcePath}
if test ${sourcePath}
then
zip -r $outName $zipFile
else
echo "zip error"
fi
echo "wait for 2s"
sleep 2s
mv $outName $gitPath
echo "packZip done"
cd $gitPath
ls -l
unzip $outName


